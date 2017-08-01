window.onscroll = function(){
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        $("#menubar").addClass('navfix');
    } else {
        $("#menubar").removeClass('navfix');
    }
}