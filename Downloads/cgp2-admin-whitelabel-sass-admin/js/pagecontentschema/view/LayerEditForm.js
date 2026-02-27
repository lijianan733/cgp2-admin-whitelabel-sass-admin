/**
 * Created by nan on 2020/8/25.
 */
Ext.define('CGP.pagecontentschema.view.LayerEditForm', {
    extend: "Ext.ux.form.ErrorStrickForm",
    defaults: {
        margin: '10 25 5 25',
        width: 500,
    },
    clazzReadOnly: false,
    scrollData: {
        left: 0,
        top: 0
    },
    data: null,
    isValidForItems: true,
    initComponent: function () {
        var me = this;
        var resource = CGP.pagecontentschema.config.Config.resource;
        me.items = [
            {
                xtype: 'numberfield',
                name: '_id',
                itemId: '_id',
                hidden: true,
                fieldLabel: resource['_id']
            },
            {
                xtype: 'checkbox',
                itemId: 'readOnly',
                fieldLabel: resource['readOnly'],
                name: 'readOnly',
                checked: false
            },
            {
                xtype: 'numberfield',
                name: 'alpha',
                itemId: 'alpha',
                hidden: true,
                fieldLabel: resource['alpha'],
                minValue: 0,
                maxValue: 1
            },
            {
                xtype: 'textfield',
                itemId: 'description',
                fieldLabel: resource['description'],
                name: 'description'
            },
            {
                xtype: 'combo',
                name: 'effectType',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            name: 'name',
                            type: 'string'
                        },
                        {
                            name: 'value',
                            type: 'string'
                        }
                    ],
                    data: [
                        {
                            name: resource['Printing'],
                            value: 'Printing'
                        }, {
                            name: resource['Laser'],
                            value: 'Laser'
                        }, {
                            name: resource['GoldFoilStamping'],
                            value: 'GoldFoilStamping'
                        }, {
                            name: resource['SilverFoilStamping'],
                            value: 'SilverFoilStamping'
                        }, {
                            name: resource['Embroidery'],
                            value: 'Embroidery'
                        }, {
                            name: resource['UV'],
                            value: 'UV'
                        }, {
                            name: resource['Embossing'],
                            value: 'Embossing'
                        }, {
                            name: resource['Glittering'],
                            value: 'Glittering'
                        }, {
                            name: resource['Carve'],
                            value: 'Carve'
                        }, {
                            name: resource['LeatherEmbossing'],
                            value: 'LeatherEmbossing'
                        }
                    ]
                }),
                displayField: 'name',
                valueField: 'value',
                editable: false,
                queryMode: 'local',
                itemId: 'effectType',
                fieldLabel: resource['effectType']
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                hidden: true,
            },
            {
                xtype: 'arraydatafield',
                name: 'tags',
                itemId: 'tags',
                minHeight: 50,
                grow: true,
                maxHeight: 100,
                resultType: 'Array',
                allowChangSort: true,
                fieldLabel: resource['标签组'],
                emptyText: '值为一数组,如：["id","color"]',
            },
            {
                xtype: 'shapeconfigfieldset',
                name: 'clipPath',
                itemId: 'clipPath',
                title: 'clipPath',
                onlySubProperty: true,
                fieldLabel: resource['clipPath']
            },
            {
                xtype: 'numberfield',
                name: 'zIndex',
                itemId: 'zIndex',
                allowDecimals: false,
                minValue: 0,
                allowBlank: true,
                tipInfo: '该值较大的配置将叠放在该值较小的配置之上',
                fieldLabel: resource['zIndex']
            }
        ];
        me.callParent();
    }
})
