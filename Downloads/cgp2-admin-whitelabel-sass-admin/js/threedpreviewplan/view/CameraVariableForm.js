Ext.define('CGP.threedpreviewplan.view.CameraVariableForm', {
    extend: 'Ext.form.Panel',


    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    header: false,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 400
    },
    layout: {
        type: 'table',
        columns: 2
    },

    initComponent: function () {

        var me = this;

        var camera = {
            xtype: 'uxfieldset',
            collapsible: false,
            style: {
                borderRadius: '10px'
            },
            padding: 10,
            itemId: 'camera',
            border: false,
            defaults: {
                width: 250
            },
            items: [
                {
                    name: 'positionX',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('X'),
                    itemId: 'positionX'
                }, {
                    name: 'positionY',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('Y'),
                    itemId: 'positionY'
                }, {
                    name: 'positionZ',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('Z'),
                    itemId: 'positionZ'
                }, {
                    name: 'cameraFov',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('cameraFov'),
                    itemId: 'cameraFov'
                }, {
                    name: 'cameraNear',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('cameraNear'),
                    itemId: 'cameraNear'
                }, {
                    name: 'cameraFar',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('cameraFar'),
                    itemId: 'cameraFar'
                }, {
                    name: 'clazz',
                    xtype: 'textfield',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.product.config.threed.model.ThreeDCamera'
                }
            ]
        };
        var baseInfo = {
            xtype: 'uxfieldset',
            collapsible: false,
            style: {
                borderRadius: '10px'
            },
            itemId: 'baseInfo',
            border: false,
            defaults: {
                width: 250
            },
            items: [{
                name: 'minZoom',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('minZoom'),
                allowDecimals: true,
                itemId: 'minZoom'
            }, {
                name: 'maxZoom',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('maxZoom'),
                allowDecimals: true,
                itemId: 'maxZoom'
            }, {
                name: 'defaultZoom',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('defaultZoom'),
                allowDecimals: true,
                itemId: 'defaultZoom'
            }, {
                name: 'zoomStep',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('zoomStep'),
                allowDecimals: true,
                itemId: 'zoomStep'
            }, {
                xtype: 'textfield',
                name: 'bgColor',
                fieldLabel: i18n.getKey('bgColor'),
                itemId: 'bgColor',
                value: '0x888888'
            },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    fieldLabel: i18n.getKey('clazz'),
                    hidden: true,
                    value: 'com.qpp.cgp.domain.product.config.model.ThreeJSVariableConfig',
                    itemId: 'clazz'
                }]
        }

        me.items = [camera, baseInfo];

        me.title = i18n.getKey('camera') + i18n.getKey('config');
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var result = {};
        var camera = me.getComponent('camera').getValue();
        var baseInfo = me.getComponent('baseInfo').getValue();
        baseInfo.camera = camera;
        result = baseInfo;
        return result;

    },
    setValue: function (data) {
        var me = this;
        var baseInfo = me.getComponent('baseInfo');
        baseInfo.setValue(data);
        var camera = me.getComponent('camera');
        camera.setValue(data.camera);
    }
})
