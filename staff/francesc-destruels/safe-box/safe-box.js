'use strict';

/**Keeps the secret in the inside function.
 * 
 * @param {string} pass 
 * @param {string} depend 
 * @param {bolean} bolean 
 */


var safeBox = (function() {
    var __password = '123';
    var __secret;
    var __message;

    function safeBox(password, secretOrNewPassword, changePassword) {
        if (password === __password) {
            if (arguments.length === 1) {
                __message = __secret;
                return __message;

            } else if (arguments.length === 2) {
                __secret = secretOrNewPassword;
                return __message = "secret saved";

            } else if (arguments.length === 3 && changePassword) {
                __password = secretOrNewPassword;
                return __message = "pass has change";   
                
            }
        } else throw Error('wrong password');
    }

    return safeBox;
})();
