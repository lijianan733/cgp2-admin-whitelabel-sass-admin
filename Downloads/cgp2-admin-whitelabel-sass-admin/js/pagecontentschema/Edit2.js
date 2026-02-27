/**
 * Created by nan on 2020/8/24.
 * 注意对旧数据的兼容
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.model.PageContentSchema',
    'CGP.pagecontentschema.view.DisplayObjectEditForm',
    'CGP.pagecontentschema.view.TSpanFieldSet',
    'CGP.pagecontentschema.view.StyleFieldSet'
]);
Ext.onReady(function () {
    var websiteStore = Ext.create('CGP.common.store.Website');
    //页面的url参数。如果id不为null。说明是编辑。
    var urlParams = Ext.Object.fromQueryString(location.search);
    var pageContentSchemaId = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var editTab = Ext.create('CGP.pagecontentschema.view.EditTab', {
        pageContentSchemaId: pageContentSchemaId,

    });
    var fontStore = Ext.create('CGP.font.store.FontStore', {
        storeId: 'fontStore'
    });
    var colorStore = Ext.create('CGP.color.store.ColorStore', {
        storeId: 'colorStore',
        model: 'CGP.pagecontentschema.view.pagecontentitemplaceholders.model.ColorModel',
        params: {
            filter: Ext.JSON.encode([{
                name: 'clazz',
                type: 'string',
                value: 'com.qpp.cgp.domain.common.color.RgbColor'
            }])
        }
    })

    if (pageContentSchemaId) {
        CGP.pagecontentschema.model.PageContentSchema.load(pageContentSchemaId, {
            failure: function (record, operation) {
            },
            success: function (record, operation) {
                //do something if the load succeeded
                var pageContentSchemaData = record.getData();
                editTab.setValue(record.raw);
            },
            callback: function (record, operation) {
            }
        });
    }
    page.add(editTab);
})
