'use strict';

/**Keeps the secret in the inside function.
 * 
 * @param {string} pass 
 * @param {string} depend 
 * @param {bolean} bolean 
 */

var safeBox = function(pass, depend, bolean){
    var password = "123", secret, infotoshow;
    
    var safeBox = (function(){
    if (pass != password) throw TypeError(pass+ ' is not the pasword');
    if (bolean != true && bolean != undefined) throw TypeError(bolean+ ' is not correct input');

    if (arguments === 1){
         return secret;
        infotoshow = secret;
    } else if (arguments === 2){
        secret[0] = depend;
        infotoshow = "secret has change";
    } else if (arguments === 3)
        secret = depend;
        password = depend;
        infotoshow = "pass has change"; 
    });

    safeBox();
}