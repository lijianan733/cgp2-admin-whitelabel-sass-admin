Ext.define('CGP.threedpreviewplan.view.ThreeDModelDataForm', {
    extend: 'Ext.form.Panel',
    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    header: false,
    padding: 10,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 350
    },
    layout: {
        type: 'table',
        columns: 2
    },

    initComponent: function () {

        var me = this;

        me.items = [
            {
                name: 'x',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('x'),
                itemId: 'positionX'
            },{
                name: 'loadType',
                xtype: 'combo',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store',{
                    fields: ['name','value'],
                    data: [{
                        name: '多模型-多材质',
                        value: 'models'
                    },{
                        name: '单模型-多材质',
                        value: 'materials'
                    }]
                }),
                fieldLabel: i18n.getKey('loadType'),
                itemId: 'loadType'
            },{
                name: 'z',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('z'),
                itemId: 'positionZ'
            },{
                name: 'name',
                xtype: 'textfield',
                //dhidden: true,
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },{
                name: 'y',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('y'),
                itemId: 'positionY'
            },{
                name: 'modelsColor',
                xtype: 'textfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('modelsColor'),
                itemId: 'modelsColor'
            },{
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                value: 'com.qpp.cgp.domain.product.config.threed.model.ThreeDModelData'
            }
        ];

        me.title = i18n.getKey('3D') + i18n.getKey('base')+ i18n.getKey('config');
        me.callParent(arguments);

    },
    getValue: function (){
        var me = this;
        var result = me.getValues();
        return result;

    },
    setValue: function (data){
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items,function (item){
            item.setValue(data[item.name]);
        })
    }
})
