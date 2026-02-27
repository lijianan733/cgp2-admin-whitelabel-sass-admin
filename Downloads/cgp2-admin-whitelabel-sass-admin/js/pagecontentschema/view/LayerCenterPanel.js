/**
 * Created by nan on 2020/8/24.
 */
Ext.define('CGP.pagecontentschema.view.LayerCenterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.layercenterpanel',
    region: 'center',
    autoScroll: true,
    itemId: 'layerCenterFormPanel',
    defaults: {
        width: 350
    },
    border: false,
    createOrEdit: 'create',
    layout: 'fit',
    data: null,
    controller: null,
    record: null,
    initComponent: function () {
        var me = this;
        me.items = [];
        me.controller = Ext.create('CGP.pagecontentschema.controller.Controller');
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var form = me.items.items[0];
        var formData = form.getValue();
        /*
                formData = Ext.Object.merge(me.data, formData);
        */
        me.controller.clearNullValueKey(formData, true, ['printFile', 'imageName', 'text', 'color']);
        if (formData.clazz == 'Container') {
            formData.items = [];
        }
        return formData;
    },
    setValue: function (data) {
        var me = this;
        me.removeAll(false);
        var item = null;
        var pathComponent = ['Path', 'Ellipse', 'Circle', 'Rectangle'];
        if (Ext.Array.contains(pathComponent, data.clazz)) {
            item = me.add(me.shapeConfigFieldSet);
        } else if (data.clazz == 'Layer') {
            item = me.add(me.layerEditForm);
        } else {
            item = me.add(me.displayObjectEditForm);

        }
        if(item.diySetValue){
            item.diySetValue(data);
        }else{
            item.setValue(data);
        }
        if (item.msgPanel) {
            item.msgPanel.hide();
        }
    },
    refreshData: function (record) {
        var me = this;
        me.record = record;
        me.displayObjectEditForm = me.displayObjectEditForm || Ext.create('CGP.pagecontentschema.view.DisplayObjectEditForm', {
            autoScroll: true,
            clazzReadOnly: true,
        });
        me.shapeConfigFieldSet = me.shapeConfigFieldSet || Ext.create('CGP.pagecontentschema.view.ShapeConfigFieldSet', {
            title: null,
            border: false,
            padding: '10 20 10 20',
            width: 600,
            clazzReadOnly: true,
            defaults: {
                width: 600,
                padding: '0 20 0 20'
            },
        });
        me.layerEditForm = me.layerEditForm || Ext.create('CGP.pagecontentschema.view.LayerEditForm', {});
        /*
                var saveBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
        */
        if (record) {
            /*
                        saveBtn.setDisabled(false);
            */
            me.setValue(record.get('data'));
            me.data = Ext.clone(record.get('data'));
        } else {
            /*
                        saveBtn.setDisabled(true);
            */
            me.removeAll(false);
            me.data = null;

        }
    },
    isValid: function () {
        var me = this;
        var form = me.items.items[0];
        if (form) {
            return form.isValid();
        } else {
            return true;
        }
    }
})
