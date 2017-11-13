angular.module('adminPanel').directive('apSelect', [
    '$timeout', '$rootScope',
    function ($timeout, $rootScope) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
                reosource: '=',
                search: '=?',
                names: '='
            },
            link: function (scope, elem, attr, ngModel) {
                //habilitamos el boton para agregar entidades
                scope.enableNewButton = !(angular.isUndefined(attr.new) || attr.new === null);
                
                //inicializamos los componentes
                scope.input = {
                    model: null,
                    vacio: true
                };
                scope.lista = {
                    items: [],
                    desplegado: false
                };
                var timeoutPromise = null;
                
                function doRequest() {
                    var request = scope.reosource.get();
                    if(request) {
                        request.$cancelRequest();
                    }
                    var promise = request.then(function(rSuccess) {
                        
                    }, function(rError) {
                        
                    });
                    scope.$emit('ap-select:request', promise);
                }
                
                //eventos relacionados con el input
                
                /**
                 * 
                 */
                scope.onChangeInput = function() {
               
                };
                
                
                //eventos relacionados con el boton
                scope.onClickButton = function() {
                    if(scope.input.vacio && !scope.lista.desplegado) {
                        scope.onFocusInput();
                    } else if(scope.lista.desplegado) {
                        if(timeoutPromise !== null) {
                            $timeout.cancel(timeoutPromise);
                        }
                        scope.lista.desplegado = false;
                    }
                    
                };
                
                //eventos relacionados con la lista
                scope.onClickItemList = function() {
                    
                };
                
            },
            templateUrl: 'directives/select/select.template.html'
        };
    }
]);
