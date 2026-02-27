Ext.define("CGP.test.pcCompare.view.PcCompareBuilder", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'east',
    width: '65%',
    minWidth: 250,
    state: 'initial',
    itemId: 'pcCompareBuilder',
    //split: true,
    //collapsible: true,
    initComponent: function(){
        var vm = this;
        vm.html = '<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' +location.origin+'/whitelabel-site/h5builder/builder-page-test/index.html' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        //me.items = [];
        var iwindow;
        vm.testData = top.buidlerCompareData = {
            "boardScale": 2,
            "opacity": 0.5,
            "pageContent": {}
        };

        window.previewBuilder = {
            api: {
                /*"initialized": function () {
                    return vm.testData;
                },*/
                "loaded": loaded
            }
        };

        function loaded() {
            //获取到builder window;
            iwindow = window.frames['tabs_iframe_pcCompare'];
        };

        vm.pcUpdate = function () {
            //vm.testData = top.buidlerCompareData;
            if(iwindow){
                if(iwindow.contentWindow){
                    iwindow.contentWindow.previewBuilder.updatePageContent(top.buidlerCompareData);
                }
            }

        };

        vm.saveAsImage = function () {
            if(iwindow){
                if(iwindow.contentWindow){
                    iwindow.contentWindow.previewBuilder.saveAsImage();
                }
            }
        };

        vm.dragRestoration = function () {
            if(iwindow){
                if(iwindow.contentWindow){
                    iwindow.contentWindow.previewBuilder.dragRestoration();
                }
            }
        };
        vm.tbar = [
            {
                text: '下载图片',
                disabled: true,
                handler: function () {
                    vm.saveAsImage()
                }
            },{
                text: '复位',
                disabled: true,
                handler: function () {
                    vm.dragRestoration()
                }
            }
        ]
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    },
    refreshData: function () {
        var me = this;
        //me.mask.hide();
        var toolbar = me.down('toolbar');
        Ext.each(toolbar.items.items,function (item) {
            item.setDisabled(false);
        });
        //me.testData = top.buidlerCompareData;
        me.pcUpdate();
        /*if(me.state == 'initial'){*/
            //me.update('<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' +'https://dev-sz-qpson-nginx.qppdev.com/whitelabel-site/h5builder/builder-page-test/index.html' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>')
        //}
    }

});
