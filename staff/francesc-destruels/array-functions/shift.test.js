suite('shift', function () {
    test('Should return the substracted element from the original array', function () {
        var answer = 1;
        var a = [1, 2, 3];

        var result = shift(a);

        expect(result, answer);
    });


    test('should add each element starting by the last index', function () {
        var answer = [2, 3];
        var a = [1, 2, 3];

        var result = shift(a);

        expect(a.toString, answer.toString);
    });


    test('should break because of undefined array', function () {
        var a = [1, 2, 3, 4, 5, 6];

        try {
          shift();

            throw Error('should not reach this point');
        } catch (error) {
            expect(error.message, 'undefined is not an array');
        }
    });
});  
