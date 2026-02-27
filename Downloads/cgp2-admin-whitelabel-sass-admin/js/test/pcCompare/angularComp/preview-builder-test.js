angular.module('myApp', ['ui.bootstrap'])
    .controller('myCtrl', [mainController]);

function mainController() {

    var vm = this;
    var iwindow;
    vm.testData = top.buidlerCompareData;

    window.previewBuilder = {
        api: {
            "initialized": function () {
                return vm.testData;
            },
            "loaded": loaded
        }
    };

    function loaded() {
        //获取到builder window;
        iwindow = window.frames['builderId'];
    };

    vm.pcUpdate = function () {
        vm.testData = top.buidlerCompareData;
        iwindow.previewBuilder.updatePageContent();
    };

    vm.saveAsImage = function () {
        iwindow.previewBuilder.saveAsImage();
    };

    vm.dragRestoration = function () {
        iwindow.previewBuilder.dragRestoration();
    };

}