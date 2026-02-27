/**
 * Created by nan on 2020/8/27.
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.canvas.view.ConstraintFieldSet',
    'CGP.pagecontentschema.view.ShapeConfigFieldSet',
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectForm',
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer',
    'CGP.pagecontentschema.model.PageContentSchema',
    'Ext.ux.form.field.RangeValueField',
    'CGP.pagecontentschema.view.canvas.config.Config'
])
Ext.onReady(function () {

    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var pageContentSchemaId = JSGetQueryString('pageContentSchemaId');

    var recordId = JSGetQueryString('recordId');
    var form = Ext.create('CGP.pagecontentschema.view.canvas.view.EditCanvasFrom', {
        recordId: recordId,
        pageContentSchemaId: pageContentSchemaId,
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        form.setLoading(true);
                        setTimeout(function () {
                            var formData = form.getValue();
                            var data = [];
                            var store = form.canvasStore;
                            var controller = Ext.create('CGP.pagecontentschema.view.canvas.controller.Controller');
                            for (var i = 0; i < store.getCount(); i++) {
                                var recordData = store.getAt(i).getData();
                                if (recordData._id == formData._id) {
                                    data.push(formData);
                                } else {
                                    data.push(recordData);
                                }
                            }
                            if (form.createOrEdit == 'create') {
                                data.push(formData);
                            }
                            controller.saveCanvas(data, pageContentSchemaId, store, form.createOrEdit == 'edit' ? 'modifySuccess' : 'addsuccessful', form);
                        }, 50)
                    }
                }
            }
        ]

    })
    page.add(form);

})
