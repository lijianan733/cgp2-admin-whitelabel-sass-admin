Ext.define('CGP.threedpreviewplan.view.preview.EditPreviewDataForm', {
    extend: 'Ext.form.Panel',
    bodyStyle: 'border-top:0;border-color:white;',
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    header: false,
    height: 450,
    width: 750,
    padding: 10,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        allowBlank: false,
        width: 300
    },
    layout: {
        type: 'table',
        columns: 2
    },

    initComponent: function () {

        var me = this;

        me.items = [{
            name: 'positionX',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('positionX'),
            itemId: 'positionX'
        },{
            name: 'cameraFov',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraFov'),
            itemId: 'cameraFov'
        },{
            name: 'positionY',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('positionY'),
            itemId: 'positionY'
        },{
            name: 'cameraNear',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraNear'),
            itemId: 'cameraNear'
        },{
            name: 'positionZ',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('positionZ'),
            itemId: 'positionZ'
        },{
            name: 'cameraFar',
            xtype: 'numberfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraFar'),
            itemId: 'cameraFar'
        },{
            name: 'bgColor',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('bgColor'),
            itemId: 'bgColor'
        },{
            name: 'clazz',
            xtype: 'textfield',
            hidden: true,
            value: 'com.qpp.cgp.domain.product.config.threed.model.ThreeDCamera'
        }];

        me.title = i18n.getKey('camera') + i18n.getKey('setting');
        me.listeners = {
            afterrender: function (){
                me.setValue();
            }
        }
        me.callParent(arguments);

    },
    getValue: function (){
        var me = this;
        var result = {};
        result = me.getValues();
        return result;

    },
    setValue: function (){
        var me = this;
        var items = me.items.items;
        var data = me.previewForm.getValues();
        data.clazz = 'com.qpp.cgp.domain.product.config.threed.model.ThreeDCamera';
        Ext.Array.each(items,function (item){
            item.setValue(data[item.name]);
        })
    }
})
