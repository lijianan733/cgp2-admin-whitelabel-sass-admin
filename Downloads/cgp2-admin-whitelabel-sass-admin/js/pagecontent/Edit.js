/**
 * Created by nan on 2020/12/14
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.ShapeConfigFieldSet',
    'CGP.pagecontent.model.PageContentModel'
]);
Ext.onReady(function () {
    Ext.apply(Ext.form.VTypes, {
        json: function (value) {//验证方法名
            try {
                var a = JSON.parse(value);
                if (Object.prototype.toString.call(a) == '[object Object]' && !Ext.Object.isEmpty(a)) {
                    return true;
                }
            } catch (e) {
                return false;
            }

        },
        jsonText: '非法JSON数据'
    });
    var pageContentId = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var editTab = Ext.create('CGP.pagecontent.view.EditTab', {
        pageContentId: pageContentId,

    });

    if (pageContentId) {
        CGP.pagecontent.model.PageContentModel.load(pageContentId, {
            failure: function (record, operation) {
            },
            success: function (record, operation) {
                //do something if the load succeeded
                var pageContentId = record.getData();
                editTab.setValue(record.raw);
            },
            callback: function (record, operation) {
            }
        });
    }
    page.add(editTab);
})
