Ext.Loader.syncRequire('CGP.bommaterial.model.MaterialModel');
Ext.define('CGP.bommaterial.edit.module.Information', {
    extend: 'Ext.ux.form.Panel',

    constructor: function (data) {
        var me = this;
        var applyConfig = {
            title: i18n.getKey('information'),
            columnCount: 1,
            model: 'CGP.bommaterial.model.MaterialModel',
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    hidden: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    value: data.name,
                    allowBlank: false
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code',
                    allowBlank: false
                },
                {
                    name: 'attributeSetId',
                    xtype: 'combo',
                    store: Ext.create('CGP.bommaterial.store.BomAttributeSets'),
                    fieldLabel: i18n.getKey('bomMaterialAttributeSet'),
                    itemId: 'attributeSetId',
                    value: data.attributeSetId,
                    readOnly: true,
                    valueField: 'id',
                    displayField: 'name'
                },
                {
                    name: 'description',
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    value: data.description
                }
            ]
        };


        me.callParent([applyConfig]);
        me.content = me;
    },

    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');
            //throw new Error('Requeied infomation must not be blank!');
        }
    },

    getValue: function () {
        var me = this;
        me.validateForm();
        var value = me.form.getValuesByModel('CGP.bommaterial.model.MaterialModel');
        return value;
    },

    setValue: function (data) {
        var me = this;
        var modelData = new CGP.bommaterial.model.MaterialModel(data);
        me.form.setValuesByModel(modelData);
    },

    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        me.getComponent('code').setValue("");
        data.id = null;
    }

});
