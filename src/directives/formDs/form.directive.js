/**
 * @description Directiva que reemplaza a <form>. Cuenta con las siguientes funcionaldiades:
 *  - Llamar a angular-validator para que se verifique si el formulario contiene errores.
 *  - Mostrar un mensaje en caso de que el formulario no sea correcto.
 *  - Realizar un scroll hasta el mensaje mencionado previamente una vez presionado el botón de submit.
 *  - Agregar el botón de submit.
 *
 *  Attrs:
 *      - id: El id de <form>
 */
angular.module('adminPanel').directive('dsForm', [
    function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: false,
            link: function ($scope, element, attr, ctrl, transclude) {
                $scope.formId = attr.id;
                $scope.errorData = {};
                var contentElement = $(element).children().eq(1);

                //Se define la función transclude para que el contenido utilice el mismo scope
                transclude($scope, function (clone, $scope) {
                    contentElement.append(clone);
                });

                $scope.$watch('errorDetails', function () {
                    if ($scope.errorDetails) {
                        transformErrorData($scope.errorDetails, $scope.errorData);
                    } else {
                        $scope.errorData = {};
                    }
                });

                /**
                 * @description Función que crea un objeto con los mensajes de error a partir de la respuesta de symfony
                 *
                 * @param {Object} dataObj Objeto data de la respuesta de symfony
                 * @param {type} newData Objeto donde se guarda el arreglo de errores
                 * @returns {undefined}
                 */
                function transformErrorData(dataObj, newData) {
                    newData.errors = [];
                    if (dataObj && dataObj.code === 400 || dataObj.code === 404) {
                        if (dataObj.errors) {
                            iterateErrorObject(dataObj.errors, newData);
                        } else {
                            var error = {
                                title: dataObj.message,
                                messages: {}
                            };
                            newData.errors.push(error);
                        }
                    }

                    function iterateErrorObject(obj, data, lastProperty) {
                        var error = {
                            title : lastProperty,
                            messages: []
                        };
                        for (var property in obj) {
                            if (obj.hasOwnProperty(property)) {
                                if (angular.isArray(obj[property]) && property === 'errors') {
                                    error.messages = error.messages.concat(obj[property]);
                                } else if (angular.isObject(obj[property])) {
                                    lastProperty = property;
                                    iterateErrorObject(obj[property], data, lastProperty);
                                }
                            }
                        }
                        data.errors = data.errors.concat(error);
                    }
                }
            },
            templateUrl: 'directives/formDs/form.template.html'
        };
    }
]);