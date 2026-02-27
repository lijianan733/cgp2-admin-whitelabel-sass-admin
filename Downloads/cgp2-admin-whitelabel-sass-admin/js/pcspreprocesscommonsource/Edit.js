Ext.Loader.syncRequire([
    'CGP.pcspreprocesscommonsource.model.SourceModel'
]);
Ext.onReady(function () {
    //页面的url参数。如果id不为null。说明是编辑。
    var recordId = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var type = JSGetQueryString('type');
    var editTab;
    if (recordId && !type){
        console.log("跳转到编辑界面");
    }else if(type === 'GridSourceConfig'){
        var editTab = Ext.create('CGP.pcspreprocesscommonsource.view.GridSourceForm');
    }else if(type === 'FlowGridSourceConfig'){
        var editTab = Ext.create('CGP.pcspreprocesscommonsource.view.FlowGridSourceForm');
    }else if (type ==='SvgFileSourceConfig'){
        var  editTab = Ext.create('CGP.pcspreprocesscommonsource.view.SvgFileSourceFrom');
    }else if (type ==='CgpDynamicSizeSourceConfig'){
        var  editTab = Ext.create('CGP.pcspreprocesscommonsource.view.CgpDynamicSizeSourceForm');
    }
    page.add(editTab);
})
