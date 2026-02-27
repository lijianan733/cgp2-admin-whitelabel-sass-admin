Ext.define("CGP.threedpreviewplan.view.preview.PreviewPanel", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'east',
    width: '65%',
    minWidth: 250,
    status: 'initialize',
    state: 'initial',
    itemId: 'pcCompareBuilder',
    threeDModelRuntime: null,
    //split: true,
    //collapsible: true,
    initComponent: function(){
        var vm = this;
        //vm.html = '<iframe id="tabs_iframe_' + '3dPreview' + '" src="' +location.origin+'/whitelabel-site/h5builder/threeD/preview/pc/3/index.html' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        //me.items = [];
        var iwindow;
        vm.testData = top.buidlerCompareData = {
            "boardScale": 2,
            "opacity": 0.5,
            "pageContent": {}
        };

        window.builder = {
            api: {
                "initialized": function (builderConfig) {
                    builderConfig.partnerToken = {access_token: Ext.util.Cookies.get('token'),token_type: 'bearer'};
                    //地址
                    builderConfig.rootPath = location.origin + '/';
                    builderConfig.threeDModelRuntime = vm.threeDModelRuntime;
                    return builderConfig;
                },
                "loaded": loaded
            }
        };

        function loaded() {
            //获取到builder window;
            iwindow = window.frames['tabs_iframe_3dPreview'];
        };

        vm.builderRefresh = function (previewData) {
            //vm.testData = top.buidlerCompareData;
            if(iwindow){
                if(iwindow.contentWindow){
                    iwindow.contentWindow.builder.refresh(previewData);
                }
            }

        };
        /*vm.tbar = [
            {
                text: '应用',
                disabled: true,
                handler: function () {
                    vm.builderRefresh()
                }
            }
        ]*/
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    },
    refreshData: function (threeDModelRuntime) {
        var me = this;
        //me.mask.hide();
        /*var toolbar = me.down('toolbar');
        Ext.each(toolbar.items.items,function (item) {
            item.setDisabled(false);
        });*/
        //me.testData = top.buidlerCompareData;
        //me.pcUpdate();
        /*if(me.state == 'initial'){*/
        me.threeDModelRuntime = threeDModelRuntime;
        me.update('<iframe id="tabs_iframe_' + '3dPreview' + '" src="' +location.origin+'/whitelabel-site/h5builder/threeD/preview/pc/3/index.html' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        me.status = 'rendered';
        //}
    }

});
