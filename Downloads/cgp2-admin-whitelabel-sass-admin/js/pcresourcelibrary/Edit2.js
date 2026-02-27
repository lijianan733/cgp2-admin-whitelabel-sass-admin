/**
 * Created by nan on 2021/9/9
 */
Ext.onReady(function () {
    //页面的url参数。如果id不为null。说明是编辑。
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
    });
    var resourceLibraryId = JSGetQueryString('id');
    var resourceType = JSGetQueryString('type');
    var outPanel = Ext.create('CGP.pcresourcelibrary.view.OutPanel', {
        resourceLibraryId: resourceLibraryId,
        resourceType: resourceType
    });
    page.add(outPanel);
})