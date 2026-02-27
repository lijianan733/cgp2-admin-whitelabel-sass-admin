Ext.define("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.PcsPreprocessPanel", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'center',
    /*    width: '65%',
        minWidth: 250,*/
    state: 'initial',
    itemId: 'pcCompareBuilder',
    //split: true,
    //collapsible: true,
    initComponent: function () {
        var vm = this;
        window.canvasData = vm.graphData;
        window.adminPath = adminPath;
        window.token = Ext.util.Cookies.get('token');
        vm.html = '<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' + location.origin + '/pcs-preprocess/' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        //me.items = [];
        var iwindow;

        vm.listeners = {
            afterrender: function () {
                iwindow = window.frames['tabs_iframe_pcCompare'];
                vm.getCanvasData = function () {
                    //vm.testData = top.buidlerCompareData;
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            return iwindow.contentWindow.getCanvasData();
                        }
                    }else{
                        Ext.Msg.alert('提示','调用方法报错！');
                    }

                };

                vm.saveImagePng = function () {
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            iwindow.contentWindow.saveCanvasPng();
                        }
                    }
                };

                vm.saveCanvasJson = function () {
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            iwindow.contentWindow.saveCanvasJson();
                        }
                    }
                };
            }
        };

        vm.tbar = [
            /*{
                text: '保存',
                //disabled: true,
                handler: function () {
                    var canvasData = vm.getCanvasData();
                    vm.graphData = vm.transform(canvasData);
                }
            },*/
            {
                text: '下载图片',
                //disabled: true,
                handler: function () {
                    vm.saveImagePng()
                }
            }/*,{
                text: '保存json',
                //disabled: true,
                handler: function () {
                    vm.saveCanvasJson()
                }
            }*/
        ]
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    }


});