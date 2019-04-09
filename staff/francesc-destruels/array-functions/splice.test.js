suite('splice', function () {
    test('Should return an array without the given id', function () {
        var answer = ["camel", "duck", "elephant"];
        var animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

        var result = splice(animals, 2, 0);

        expect(result.toString, answer.toString);
    });


    test('should add each element starting by the last index', function () {
        var answer = [1, 5, 6];
        var a = [1, 2, 3, 4, 5, 6];

        var result = splice(a, 1, 3);

        expect(result.toString, answer.toString);
    });


    test('should break because of undefined array', function () {
        var a = [1, 2, 3, 4, 5, 6];

        try {
          slice();

            throw Error('should not reach this point');
        } catch (error) {
            expect(error.message, 'undefined is not an array');
        }
    });
});  
