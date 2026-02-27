Ext.define('CGP.threedpreviewplan.view.preview.CameraInfo', {
    extend: 'Ext.form.Panel',



    defaultType: 'displayfield',
    bodyStyle: 'border-color:black;',
    /*header: {
        style: 'background-color:white;border-color:white;',
        color: 'black',
    },*/
    header:false,
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 150
    },
    layout: {
        type: 'table',
        columns: 2
    },

    initComponent: function () {

        var me = this;
        me.items = [{
            name: 'positionX',
            xtype: 'displayfield',
            hideTrigger: true,
            labelWidth: 50,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('X'),
            itemId: 'positionX'
        },{
            name: 'positionY',
            xtype: 'displayfield',
            hideTrigger: true,
            labelWidth: 50,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('Y'),
            itemId: 'positionY'
        },{
            name: 'positionZ',
            labelWidth: 50,
            xtype: 'displayfield',
            hideTrigger: true,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('Z'),
            itemId: 'positionZ'
        },{
            name: 'cameraFov',
            xtype: 'displayfield',
            hideTrigger: true,
            labelWidth: 80,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraFov'),
            itemId: 'cameraFov'
        },{
            name: 'cameraNear',
            xtype: 'displayfield',
            hideTrigger: true,
            autoStripChars: true,
            labelWidth: 80,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraNear'),
            itemId: 'cameraNear'
        },{
            name: 'cameraFar',
            xtype: 'displayfield',
            hideTrigger: true,
            labelWidth: 80,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('cameraFar'),
            itemId: 'cameraFar'
        },{
            name: 'bgColor',
            labelWidth: 80,
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('bgColor'),
            itemId: 'bgColor'
        },{
            name: 'clazz',
            xtype: 'textfield',
            hidden: true,
            value: 'com.qpp.cgp.domain.product.config.threed.model.ThreeDCamera'
        }];
        /*me.bbar = ['->',{
            title: i18n.getKey('edit'),
            handler:function (){

            }
        }]*/
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',

            bodyStyle: 'border-color:white;',
            border: '0 0 0 0',
            items:[
                {xtype: 'displayfield',
                    fieldLabel: false,
                    value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('camera') + i18n.getKey('config')+ '</font>'},
                {
                    itemId: 'button',
                    xtype: 'button',
                    text: i18n.getKey('edit'),
                    handler: function (){
                        var formData = me.getValues();
                        Ext.create('CGP.threedpreviewplan.view.preview.EditPreviewDataWin',{
                            testPlanData: me.modelInfoForm.testPlanData,
                            formData: formData,
                            modelInfoForm: me.modelInfoForm,
                            previewForm: me
                        });
                    }
                }]

        }];
        me.callParent(arguments);

    },
    setValue: function (data){
        var me = this;
        var items = me.items.items;
        if(me.rendered){
            Ext.Array.each(items,function (item){
                item.setValue(data[item.name]);
            })
        }else{
            me.on('afterrender',function (){
                Ext.Array.each(items,function (item){
                    item.setValue(data[item.name]);
                })
            })
        }

    },
    getValues: function (){
        var me = this;
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items,function (item){
            data[item.name] = item.getValue();
        });
        return data;
    }
})


