/*global Q*/
//var dev = false;
/**
 *  Internal stuff for handling iframe communication and processing.  Fun times
 *
 *  There are hooks that can be defined in the instructor code that will be called at particular
 *  times prior to and after the student submission has been executed.
 *
 *  - initializeFrame(): Occurs before any student code has been injected into the page.  Should
 *      be used to do any preliminary setup
 *  - performTesting(): Called when the Submission is set to TEST
 *  - performSubmission(): Called when the Submission is set to GRADE
 *
 *  Each hook is better defined below
 */

// Because IE devs evidently twiddle their thumbs all day instead of
// actually implementing basic feature support for things that
// BLACKBERRY SEVEN freaking has.
function fUIE(maybeJson) {
  try {
    return JSON.parse(maybeJson);
  } catch (exception) {
    return maybeJson;
  }
}


/**
 * Utility function because location.origin isn't cross-browser compatible
 */
function _getOrigin() {
  var origin;
  if (!window.location.origin) {
    var loc = window.location;
    origin = loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '');
  }
  return window.location.origin || origin;
}

/**
 * Utility function that checks whether or not the given domain is in our trusted list
 * Note: this needs to be manually updated whenever the isTrustedDomain service is
 */
function isTrustedDomain(domain) {
  'use strict';
  return domain.indexOf('.udacity.com') > -1 || domain === 'http://localhost:5000' || domain === 'https://assignments-dot-udacity-extras.appspot.com';
}

/**
 * Initializes a more or less blank iframe before anything the student has done is perform.  Mostly
 * an affordance, as I have no idea what you plan on doing here
 */

function initializeFrame(){}

/**
 * Called on all student TEST Submissions (i.e. The Run Code button was clicked).  It is assumed
 * that at some point in this function you will make a call to returnExecution() with some
 * meaningful data to be sent back to the server.  Otherwise the student will have no record of the
 * assignment and that, my friend, would be pretty sad.
 *
 * @returns An object to be sent back as the result of the execution.  If this isn't set, errors
 *     will be logged
 */

function performTesting(){
  return {};
}

/**
 * Called on all student GRADE Submissions (i.e. The Submit button was clicked).  It is assumed that
 * at some point in this function you will make a call to returnExecution() with some meaningful
 * data to be sent back to the server.  Otherwise the student will have no record of the submission
 * and that, my friend, would be pretty sad.
 *
 * @returns An object to be sent back as the result of the execution.  If this isn't set, errors
 *     will be logged
 */

function performSubmission(){
  return {};
}


/**
 * Wraps the required perform___ call and creates the appropriate Submission / SubmissionExecution
 * object pair to return back to the server.  If the execution does not return anything meaningful,
 * prints an error to console.error.
 *
 * @param parentWindow The parent for the iframe.  Damn well better be Udacity because the
 *     targetOrigin is going to be hardcoded for it >_>
 * @param submission The original submission received by the iframe, unmodified
 */

function _returnExecution(parentWindow, submission) {
  var execution = {};
  var useFun;
  var result = {};
  if (submission.operation === 'TEST') {
    useFun = performTesting;
  } else if (submission.operation === 'GRADE') {
    useFun = performSubmission;
  } else {
    useFun = performTesting;
  }

  //the result may be a Q promise, so wrap it and treat it as one either way
  execution = Q.when(useFun());
  var handleResult = function (executionResult, status) {
    if (JSON.stringify(executionResult) === '{}') {
      console.error(useFun.name + ' returned a trivial result for the execution.');
    }

    // Construct the result to send back
    result.messageType = 'execution';
    result.result = {
      submission: submission,
      execution: {
        model: 'SubmissionExecution',
        status: (status || 'ok'),
        'raw_result': executionResult
      }
    };
    //console.log("in utils " + JSON.stringify(result));
    // Post the response if this frame is running in a trusted domain
    //parentWindow.postMessage(JSON.stringify(result), 'http://localhost:8080');
    //there's really nothing to protect here - just results of submissions. So I'd prefer just leaving this a *
    parentWindow.postMessage(JSON.stringify(result), '*');
    //TODO fix this
    // if (isTrustedDomain(_getOrigin()) && parentWindow !== window) {
    // 	parentWindow.postMessage(JSON.stringify(result), _getOrigin());
    // }
    // if (isTrustedDomain(_getOrigin()) && parentWindow !== window) {
    // 	if (dev === true) {
    // 	 	parentWindow.postMessage(JSON.stringify(result), 'http://localhost:8080');
    // 	} else {
    // 		parentWindow.postMessage(JSON.stringify(result), 'https://www.udacity.com');
    // 	}

    // }
  };

  execution.then(function success(executionResult) {
    handleResult(executionResult, 'ok');
  }, function error(executionResult) {
    // te === transient error
    handleResult(executionResult, 'te');
  });
}


/**
 * Handle Javascript contents by writing it as a tag to the page
 * @param contents The raw Javascript to be injected into the page
 */

function _handleJavascript(contents) {
  var newScript = document.createElement('script');
  newScript.setAttribute('type', 'text/javascript');
  newScript.text = contents;
  document.getElementsByTagName('head')[0].appendChild(newScript);
}

/**
 * Handle adding any additional HTML bodies to the page.  Creates a new, unstylable div
 * @param contents The HTML text that can be used as innerHTML to the new div
 */
function _handleHTML(contents) {
  var newDiv = document.createElement('div');
  newDiv.innerHTML = contents;
  document.getElementsByTagName('body')[0].appendChild(newDiv);
}

/**
 * Handle Shader contents by writing it as a tag to the page
 * @param contents The raw shader code to be injected into the page
 * @param shadertype Type of the shader (vertex or fragment)
 */

function _handleShader(contents, shadertype) {
  var newScript = document.createElement('script');
  newScript.type = 'text/x-glsl';
  newScript.id = shadertype;
  newScript.text = contents;
  document.getElementsByTagName('body')[0].appendChild(newScript);
}

/**
 * Handles any messages received by this iframe.  Will only accept from udacity.com
 * @param event The event for the POST message received by this iframe
 */
function receiveMessage(event) {
  // Dacity onry
  if (isTrustedDomain(event.origin) && event.data) {
    initializeFrame();
    var message = fUIE(event.data);
    // The only messages coming in should be injecting JS code into here
    if (message.parts) {
      var index;
      // shaders have to be injected first so that they are available to js
      for (index = 0; index < message.parts.length; index++) {
        var contents = message.parts[index].content;
        var filename = message.parts[index].marker.split('.');
        var extension = filename[filename.length -1];
        if (extension == 'glsl') {
          _handleShader(contents, filename[0]);
        }
      }
      for (index = 0; index < message.parts.length; index++) {
        var contents = message.parts[index].content;
        var filename = message.parts[index].marker.split('.');
        var extension = filename[filename.length -1];
        switch (extension){
          case ('js'):
            _handleJavascript(contents);
            break;
          case ('html'):
            _handleHTML(contents);
            break;
        }
      }
    }

    // Actually handle the submission here
    _returnExecution(event.source, message);
  }
}


/**
 * Posts to the parent that we have been instantiated.  Must be a safe place <3
 */
function postReady() {
  // Seriously, is there a point to securing this?
  if (window.parent !== window) {
    //window.parent.postMessage(JSON.stringify({messageType: 'ready'}), 'http://localhost:8080');
    window.parent.postMessage(JSON.stringify({messageType: 'ready'}), '*');
  }
  // if (window.parent !== window) {
  // 	if (dev === true) {
  // 		window.parent.postMessage(JSON.stringify({messageType: 'ready'}), 'http://localhost:8080');
  // 	} else {
  // 		window.parent.postMessage(JSON.stringify({messageType: 'ready'}), 'https://www.udacity.com');
  // 	}
  // }
}

// Do the things we need to do to initialize state
window.addEventListener('message', receiveMessage);

// Let the viewer know we are ready
$(document).ready(function () {
  postReady();
});