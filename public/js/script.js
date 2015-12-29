$(document).ready(function() {
  $('code').each(function(i, block) {
    hljs.highlightBlock(block);
    $(block).click(function(){
      selectElementContents(block);
    })
  });

  $("#tableOfContents").tableOfContents('.inner-tutorial', { startLevel: '3', depth: '3' } );
 
  var toc = document.getElementById('tableOfContents');
  if (toc) {
    window.onscroll = function() {
      var innerTutorial = document.getElementsByClassName('inner-tutorial');

      var className = 'fixed';

      if (innerTutorial[0].getBoundingClientRect().top <= 40 ) {

        if (toc.classList)
          toc.classList.add(className);
        else
          toc.className += ' ' + className;


      } else {

        if (toc.classList)
          toc.classList.remove(className);
        else
          toc.className = toc.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');


      }
    }
  }
  

});


/* 

if (el.classList)
  el.classList.add(className);
else
  el.className += ' ' + className;

if (el.classList)
  el.classList.remove(className);
else
  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

*/

function selectElementContents(el) {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

// function isElementInViewport (el) {

//     //special bonus for those using jQuery
//     if (typeof jQuery === "function" && el instanceof jQuery) {
//         el = el[0];
//     }

//     var rect = el.getBoundingClientRect();

//     return (
//         rect.bottom >= 0 &&
//         rect.top <= (window.innerHeight || document.documentElement.clientHeight) 
//     );
// }

// function isElementTouchingTopViewport (el) {

//     //special bonus for those using jQuery
//     if (typeof jQuery === "function" && el instanceof jQuery) {
//         el = el[0];
//     }

//     var rect = el.getBoundingClientRect();

//     return (
//         rect.bottom >= 0 &&
//         rect.top <= (window.innerHeight || document.documentElement.clientHeight) 
//     );
// }

// function onVisibilityChange (el, callback) {
//     return function () {
//         /*your code here*/ console.log('visibility: ' + isElementInViewport(el));
//         for(var i = 0; i <= 3; i++) {
// 	        if (isElementInViewport($("div.main-tutorial.part" + i))) {
// 				$("ul#toc > li:nth-child("+(i+1)+") ul").show(400);
// 			} else {
// 				$("ul#toc > li:nth-child("+(i+1)+") ul").hide(200);
// 			}        	
//         }
//     };
// }

