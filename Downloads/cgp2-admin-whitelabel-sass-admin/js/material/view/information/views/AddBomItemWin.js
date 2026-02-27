Ext.Loader.syncRequire(['Ext.ux.form.GridField',
    'CGP.material.model.BomItem',
    'CGP.material.override.NodeInterface',
    'CGP.material.override.Model',
    'CGP.material.model.Material',
    'CGP.common.field.QuantityDesc',
    'CGP.material.store.Material',
    'CGP.material.override.TreeStore',
    'CGP.common.field.MaterialSelectField']);
Ext.define('CGP.material.view.information.views.AddBomItemWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    bomItemType: null,
    editOrNew: null,
    minHeight: 250,
    width: 420,
    materialData: null,
    isCanSave: false,//是否能保存
    /**
     * 获取到当前配置
     * @returns {null|*}
     */
    getValue: function () {
        var me = this;
        var items = me.form.items.items;
        var data = me.form.getValues();
        if (!Ext.isEmpty(data.min)) {
            data.range = {
                min: data.min,
                max: data.max,
                clazz: 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItemItemRange'
            }
        }
        delete data.min;
        delete data.max;
        delete data.editBtn;
        delete data.selectTypeBtn;
        delete data.quantityType;
        if (me.quantityType == 'Fix') {
            data.quantity = me.form.getComponent('quantityContainer').getComponent('numberType').getValue();
            delete data.quantityDesc;
        } else {
            delete data.quantity;
            data.quantityDesc = me.quantityDesc;
        }
        var materialName;
        Ext.Array.each(items, function (item) {
            if (item.name == 'displayMaterial') {
                materialName = item.getRawValue();
            }
        });
        //现在返回的是一个对象
        data.itemMaterial = {
            _id: data.displayMaterial['_id'],
            clazz: data.displayMaterial['clazz'],
            idReference: 'Material'
        };
        if (Ext.isEmpty(me.record)) {
            //这是添加的代码操作
            var bomItemId = JSGetCommonKey();
            if (bomItemId) {
                var bomItemIdStr = bomItemId.toString();
                data._id = bomItemIdStr;
                if (data.optionalMaterials) {
                    var optionalMaterials = data.optionalMaterials;
                    var optionalArr = [];
                    Ext.Array.each(optionalMaterials, function (item) {
                        optionalArr.push({
                            _id: item["_id"],
                            idReference: 'Material',
                            clazz: item["clazz"]
                        })
                    })
                }
                data.optionalMaterials = optionalArr;
            } else {
                return null;
            }
        }
        return data;
    },
    constructor: function () {
        var me = this;
        me.initConfig(arguments);
        me.bbar = me.bbar || [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                disabled: me.isCanSave,
                handler: function () {
                    if (me.form.isValid()) {
                        var lm = me.setLoading();
                        var data = me.getValue();
                        if (Ext.isEmpty(data)) {
                            return;
                        }
                        if (Ext.isEmpty(me.record)) {//这是添加的代码操作
                            me.store.add(data);
                            //创建对应bomItem类型的store
                            var FixedBOMItemGridStore = Ext.data.StoreManager.getByKey('FixedBOMItemGridStore');
                            var UnassignBOMItemGridStore = Ext.data.StoreManager.getByKey('UnassignBOMItemGridStore');
                            var OptionalBOMItemGridStore = Ext.data.StoreManager.getByKey('OptionalBOMItemGridStore');
                            //添加记录
                            if (data.clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                UnassignBOMItemGridStore.add(data);
                            } else if (data.clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                                FixedBOMItemGridStore.add(data);
                            } else if (data.clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                                OptionalBOMItemGridStore.add(data);
                            }
                        } else {//这是修改的代码操作
                            var supStoreRecord = '';
                            var displayMaterial = data.displayMaterial;
                            var supStore = Ext.data.StoreManager.getByKey('BomItem');
                            for (var i = 0; i < supStore.getCount(); i++) {
                                supStoreRecord = supStore.getAt(i);
                                if (supStoreRecord.get('_id') == me.record.get('_id')) {
                                    break;
                                }
                            }
                            me.record.beginEdit();
                            Ext.Object.each(data, function (key, value) {
                                if (key === 'displayMaterial') {
                                    var itemMaterial = {
                                        _id: displayMaterial['_id'],
                                        clazz: displayMaterial['clazz'],
                                        idReference: 'Material'
                                    };
                                    me.record.set('itemMaterial', itemMaterial);
                                    supStoreRecord.set('itemMaterial', itemMaterial);
                                } else {
                                    if (me.quantityType == 'Fix') {
                                        if (key == 'quantity') {
                                            me.record.set('quantityDesc', undefined);
                                            supStoreRecord.set('quantityDesc', undefined);
                                        }
                                        me.record.set(key, value);
                                        supStoreRecord.set(key, value);
                                    } else {
                                        if (key == 'quantityDesc') {
                                            me.record.set('quantity', undefined);
                                            supStoreRecord.set('quantity', undefined);
                                        }
                                        me.record.set(key, value);
                                        supStoreRecord.set(key, value);
                                    }
                                }
                            })
                            me.record.endEdit();
                        }
                        lm.hide();
                        me.close();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }];
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey("bomItem");
        var controller = Ext.create('CGP.material.controller.Controller');
        if (me.editOrNew == 'add') {
            me.quantityType = 'Fix';
        } else {
            if (!Ext.isEmpty(me.record.get('quantityDesc'))) {
                me.quantityType = 'QuantityDesc'
            } else {
                me.quantityType = 'Fix'
            }
        }
        me.quantityDesc = me.record == null ? null : me.record.get('quantityDesc');
        var store1 = Ext.create('CGP.material.store.Material', {
            root: me.rootNode,
        });
        var store2 = Ext.create('CGP.material.store.Material', {
            root: me.rootNode,
        });
        store2.on('load', function (store, node, records) {
            Ext.each(records, function (record) {
                record.set('checked', false);
            })
        });
        var quantity = {
            xtype: 'uxfieldcontainer1',
            fieldLabel: i18n.getKey('quantity') + '(' + me.quantityType + ')',
            itemId: 'quantityContainer',
            layout: 'hbox',
            name: 'quantityContainer',
            listeners: {},
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: false,
                    name: 'quantity',
                    flex: 1,
                    minValue: 1,
                    allowBlank: me.bomItemType != 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem',
                    value: me.record == null ? 1 : me.record.get('quantity'),
                    itemId: 'numberType'
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('compile'),
                    itemId: 'quantityDesc',
                    flex: 1,
                    name: 'editBtn',
                    handler: function (btn) {
                        var container = btn.ownerCt;
                        var form = container.ownerCt;
                        var AddBomItemWin = form.ownerCt;
                        var selectWin = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            layout: 'fit',
                            title: i18n.getKey('quantityDesc'),
                            items: [
                                {
                                    xtype: 'errorstrickform',
                                    border: false,
                                    title: false,
                                    items: [{
                                        itemId: 'quantityDesc',
                                        name: 'quantityDesc',
                                        xtype: 'quantitydesc'
                                    }]
                                }
                            ],
                            bbar: {
                                xtype: 'bottomtoolbar',
                                saveBtnCfg: {
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var form = win.items.items[0];
                                        if (form.isValid()) {
                                            var data = form.getValue();
                                            console.log(data);
                                            AddBomItemWin.quantityDesc = data.quantityDesc;
                                            win.close();
                                        }
                                    }
                                }
                            },
                            listeners: {
                                afterrender: function () {
                                    var me = this;
                                    if (AddBomItemWin.quantityDesc) {
                                        var form = me.items.items[0];
                                        var quantityDesc = form.getComponent('quantityDesc');
                                        quantityDesc.setValue(AddBomItemWin.quantityDesc);
                                    }
                                }
                            }
                        });
                        selectWin.show();
                    }
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    itemId: 'quantityType',
                    name: 'quantityType',
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            var container = comp.ownerCt;
                           
                            var numberType = container.getComponent('numberType');
                            var quantityDesc = container.getComponent('quantityDesc');
                            if (newValue == 'QuantityDesc') {
                                numberType.setVisible(false);
                                numberType.allowBlank = true;
                                numberType.setDisabled(true);
                                quantityDesc.setVisible(true);
                            } else {
                                numberType.setVisible(true);
                                numberType.allowBlank = false;
                                numberType.setDisabled(false);
                                quantityDesc.setVisible(false);
                            }
                        },
                        render: function (comp) {
                            comp.setValue(me.quantityType);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('modify') + i18n.getKey('type'),
                    margin: '0 0 0 10',
                    hidden: me.quantityType == 'Fix',
                    name: 'selectTypeBtn',
                    handler: function () {
                        var container = this.ownerCt;
                        var quantityTypeComp = container.getComponent('quantityType');
                        var numberType = container.getComponent('numberType');
                        var quantityDesc = container.getComponent('quantityDesc');
                        Ext.create('Ext.window.Window', {
                            width: 350,
                            height: 150,
                            modal: true,
                            layout: 'fit',
                            title: i18n.getKey('choice') + i18n.getKey('type'),
                            items: [
                                {
                                    xtype: 'form',
                                    border: false,
                                    title: false,
                                    padding: 10,
                                    items: [
                                        {
                                            xtype: 'combo',
                                            width: 300,
                                            editable: false,
                                            itemId: 'typeCombo',
                                            allowBlank: false,
                                            fieldLabel: i18n.getKey('type'),
                                            store: Ext.create('Ext.data.Store', {
                                                fields: ['name', 'value'],
                                                data: [
                                                    {name: 'Fix', value: 'Fix'},
                                                    {name: 'QuantityDesc', value: 'QuantityDesc'}
                                                ]
                                            }),
                                            displayField: 'name',
                                            valueField: 'value',
                                            queryMode: 'local'
                                        }
                                    ]
                                }
                            ],
                            bbar: ['->', {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                handler: function () {
                                    var win = this.ownerCt.ownerCt;
                                    var combo = win.down('form').getComponent('typeCombo');
                                    quantityTypeComp.setValue(combo.getValue());
                                    me.quantityType = combo.getValue();
                                    container.setFieldLabel(i18n.getKey('quantity') + '(' + me.quantityType + ')');
                                    win.close();
                                }
                            }, {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function () {
                                    var win = this.ownerCt.ownerCt;
                                    win.close();
                                }
                            }]
                        }).show();
                    }
                }
            ]
        };
        var materialCombo = {
            xtype: 'materialselectfield',
            name: 'displayMaterial',
            store: store1,
            fieldLabel: i18n.getKey('itemMaterial'),
            itemId: 'displayMaterial',
            rootVisible: me.rootVisible,
            multiselect: false,
            useRawValue: true,
            selType: 'rowmodel',
            /*          现在固定件也可选SMT
                        vtype: (me.materialData.type == 'MaterialSpu' ? 'onlySMU' : null),
            */
        };
        var multiMaterialCombo = {
            xtype: 'materialselectfield',
            name: 'optionalMaterials',
            useRawValue: true,
            fieldLabel: i18n.getKey('optionalMaterials'),
            itemId: 'optionalMaterials',
            store: store2,
            isObj: true,
            allowBlank: me.bomItemType != 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem',
            rootVisible: me.rootVisible,
            multiselect: true,
        };
        var id = {
            xtype: 'textfield',
            name: '_id',
            itemId: 'id',
            fieldLabel: i18n.getKey('id')
        };
        var sourceBomItemId = {
            xtype: 'textfield',
            name: 'sourceBomItemId',
            hidden: true,
            allowBlank: true,
            itemId: 'sourceBomItemId',
            fieldLabel: i18n.getKey('sourceBomItemId')
        };
        var minField = {
            name: 'min',
            xtype: 'numberfield',
            itemId: 'min',
            id: 'min',
            minValue: 0,
            listeners: {
                change: function (field, record, index) {
                    field.setMaxValue(Ext.getCmp('max').getValue());
                }
            },
            fieldLabel: i18n.getKey('minValue'),
            allowBlank: false
        };
        var maxField = {
            name: 'max',
            xtype: 'numberfield',
            itemId: 'max',
            minValue: 1,
            id: 'max',
            listeners: {
                change: function (field, record, index) {
                    field.setMinValue(Ext.getCmp('min').getValue());
                }
            },
            fieldLabel: i18n.getKey('maxValue'),
            allowBlank: false
        };
        var name = {
            xtype: 'textfield',
            name: 'name',
            itemId: 'name',
            fieldLabel: i18n.getKey('name')
        };
        /*var code = {
         xtype: 'textfield',
         name: 'code',
         itemId: 'code',
         fieldLabel: i18n.getKey('code')
         };*/
        var quantityStrategy = {
            xtype: 'combo',
            valueField: 'value',
            displayField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [
                    {
                        name: 'basic',
                        value: 'basic'
                    },
                    {
                        name: 'radio',
                        value: 'radio'
                    }
                ]
            }),
            editable: false,
            queryMode: 'local',
            value: 'basic',
            hidden: true,
            name: 'quantityStrategy',
            itemId: 'quantityStrategy',
            fieldLabel: i18n.getKey('quantityStrategy')
        };
        var clazz = {
            xtype: 'combo',
            name: 'clazz',
            itemId: 'clazz',
            id: 'clazz',
            readOnly: true,
            fieldStyle: 'background-color:silver',
            fieldLabel: i18n.getKey('type'),
            value: me.bomItemType != null ? me.bomItemType : '',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [
                    {
                        name: '固定件',
                        value: 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem'
                    },
                    {
                        name: '可选件',
                        value: 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem'
                    },
                    {
                        name: '待定件',
                        value: 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem'
                    }
                ]
            }),
            displayField: 'name',
            valueField: 'value',
            queryMode: 'local'
        };
        var range = {
            xtype: 'uxfieldcontainer',
            fieldLabel: i18n.getKey('range'),
            name: 'range',
            itemId: 'range',
            items: [
                {
                    name: 'min',
                    xtype: 'numberfield',
                    itemId: 'min',
                    id: 'min',
                    labelWidth: 50,
                    minValue: 0,
                    listeners: {
                        change: function (field, record, index) {
                            field.setMaxValue(Ext.getCmp('max').getValue());
                        }
                    },
                    fieldLabel: i18n.getKey('minValue'),
                    allowBlank: false
                },
                {
                    name: 'max',
                    xtype: 'numberfield',
                    itemId: 'max',
                    labelWidth: 50,
                    minValue: 1,
                    id: 'max',
                    listeners: {
                        change: function (field, record, index) {
                            field.setMinValue(Ext.getCmp('min').getValue());
                        }
                    },
                    fieldLabel: i18n.getKey('maxValue'),
                    allowBlank: false
                }
            ]
        }
        me.items = [
            {
                xtype: 'form',
                id: 'bomItemForm',
                border: false,
                autoScroll: true,
                defaults: {
                    width: 350,
                    margin: '10 25 10 25',
                    allowBlank: false
                },
                listeners: {
                    beforerender: function (comp) {
                        if (!Ext.isEmpty(me.record)) {
                            var type = me.record.get('type');
                            if (type == 'FixedBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo);
                            } else if (type == 'OptionalBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo, multiMaterialCombo);
                            } else if (type == 'UnassignBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo, multiMaterialCombo, range);
                            }
                        } else {
                            if (me.bomItemType == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo);
                            } else if (me.bomItemType == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo, multiMaterialCombo);
                            } else if (me.bomItemType == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                comp.add(clazz, name, sourceBomItemId, quantityStrategy, quantity, materialCombo, multiMaterialCombo, range);
                            }
                        }
                    }
                },
                items: []
            }
        ];
        me.callParent(arguments);
        me.form = me.down('form');
        if (me.record) {
            me.form.on('afterrender', function () {
                //抽出需要使用到uxtreecomhaspaging的组件字段
                var optionalMaterialsValue = me.record.data.optionalMaterials;
                var itemMaterialValue = me.record.data.itemMaterial;
                delete me.record.data.optionalMaterials;
                delete me.record.data.itemMaterial;
                me.form.loadRecord(me.record);
                me.record.data.optionalMaterials = optionalMaterialsValue;
                me.record.data.itemMaterial = itemMaterialValue;
                if (!Ext.isEmpty(optionalMaterialsValue)) {
                    me.form.getComponent('optionalMaterials').setInitialValue(optionalMaterialsValue);
                }
                if (itemMaterialValue) {
                    me.form.getComponent('displayMaterial').setInitialValue(itemMaterialValue);
                }
                var range = me.form.getComponent('range');
                if (range) {
                    range.setValue(me.record.get('range'));
                }
            });
        }
    }
})
