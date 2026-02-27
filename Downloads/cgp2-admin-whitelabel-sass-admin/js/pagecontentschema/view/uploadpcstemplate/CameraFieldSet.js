/**
 * Created by admin on 2019/12/21.
 */
Ext.define('CGP.threedmodelconfig.view.CameraFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    height: 110,
    colspan: 2,
    productId: null,
    title: i18n.getKey('pcs')+i18n.getKey('info'),
    defaults: {
        /*
         labelAlign: 'top',
         */
        allowBlank: false,
        width: 250,
        margin: '10 10 0 10'
    },
    layout: {
        type: 'table',
        columns: 3
    },
    style: {
        borderRadius: '10px'
    },
    getName: function () {
        return this.name;
    },
    isValid:function(){
        var me = this;
        var items = me.items.items;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            result[item.getName()] = item.getValue();
        }
        return result
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data[item.getName()]);
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'positionX',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('positionX'),
                itemId: 'positionX'
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
                name: 'positionZ',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('positionZ'),
                itemId: 'positionZ'
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
                name: 'cameraNear',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('cameraNear'),
                itemId: 'cameraNear'
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
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                value: 'com.qpp.cgp.domain.product.config.model.ThreeDCamera'
            }
        ];
        me.callParent(arguments);
    }

});
