Ext.onReady(function () {

    //me.sidebar(true)[3];
    //return trees;
    var controller = Ext.create('CGP.test.pcCompare.controller.Controller');
    var productInstanceId = JSGetQueryString('productInstanceId');
    var productInstance = controller.getProductInstance(productInstanceId);
    var compareType = JSGetQueryString('compareType');
    var pcCatalog = Ext.create('CGP.test.pcCompare.view.TreeCatalog',{
        productInstance: productInstance,
        compareType: compareType,
        mainPage: page
    });
    var cachePicturePcPanel = Ext.create('CGP.test.pcCompare.view.CachePicturePcPanel',{
        productInstance: productInstance,
        compareType: compareType
    });
    var builderPanel = Ext.create('CGP.test.pcCompare.view.PcCompareBuilder',{
        state: 'initial'
    });
    var finalItems = [];
    //if(compareType == 'cacheImageCompare'){
    finalItems = [pcCatalog,cachePicturePcPanel,builderPanel];/*
    }else{
        finalItems = [pcCatalog,cachePicturePcPanel];
    }*/
    var page = Ext.create('Ext.container.Viewport', {
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },

        items: finalItems
    })
});