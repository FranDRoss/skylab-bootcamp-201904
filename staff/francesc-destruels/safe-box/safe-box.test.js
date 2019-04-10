'use strict';

describe('safe-box', function () {

    it('Should retrive nothing', function () {
        
        var result = safeBox("123", "I do not like you");

        expect(result, "secret saved");
    });

    it('Should retrieve the secret', function () {

        var result = safeBox("123");

        expect(result, "I do not like you");
    });

    it('Should change the pass', function () {
        
        var result = safeBox("123", "tomate", true);

        expect(result, "pass has change");
    });

});