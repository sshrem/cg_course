/**
 * Created by shrem on 11/19/17.
 */


function saveAsImage() {
  var imgData, imgNode;

  try {
    var strMime = "image/jpeg";
    var strDownloadMime = "image/octet-stream";
    imgData = renderer.domElement.toDataURL(strMime);
    $("#image").attr("src",imgData);

       saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

  } catch (e) {
    console.log(e);
    return;
  }

}

var saveFile = function (strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
}
