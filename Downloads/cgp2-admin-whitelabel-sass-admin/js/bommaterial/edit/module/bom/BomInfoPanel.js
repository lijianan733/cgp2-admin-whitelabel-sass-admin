Ext.syncRequire(['Ext.form.field.GridComboBox'])

Ext.define("CGP.bommaterial.edit.module.bom.BomInfoPanel",{
    extend: 'Ext.form.Panel',
    border: false,
    initComponent: function(){
        var me = this;
        //me.title = i18n.getKey('bomInformation');
        header: false,
        me.fieldDefaults = {
            style: 'margin:10px',
            width: 650,
            allowBlank: false,
            readOnly: !me.record.get('editable')
        };
        me.listeners = {
            beforerender: function(com){
                if(me.record.get('type') == 'FIXED'){
                    com.add([id,parentMaterialId,bomItemType,bomName,quantityStrategy,itemMaterial,path,nodeId])
                }else if(me.record.get('type') == 'UNASSIGN'){
                    com.add([id,parentMaterialId,bomItemType,bomName,quantityStrategy,itemRangeMin,itemRangeMax,itemMaterial,path,nodeId])
                }else if(me.record.get('type') == 'OPTIONAL'){
                    com.add([id,parentMaterialId,bomItemType,bomName,quantityStrategy,itemMaterial,selectableMaterials,path,nodeId])
                }
            }
        };
        me.tbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            disabled: !me.record.get('editable'),
            handler: function(){
                var form = this.ownerCt.ownerCt;
                if(form.isValid()){
                    me.controller.modifyBomItem(form,me.tree);
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey("CheckCusAttri"),
            handler: function(){
                var form = this.ownerCt.ownerCt;
                var materialId = Object.keys(form.getComponent('itemMaterial').getValue())[0];
                me.controller.checkCusAttri(materialId);
            }
        },{
            xtype: 'button',
            text: i18n.getKey('checkBomItem'),
            //hidden: me.record.get('leaf'),
            handler: function(){
                var form = this.ownerCt.ownerCt;
                var nodeID = form.getComponent('nodeId').getValue();
                var materialId = Object.keys(form.getComponent('itemMaterial').getValue())[0];
                var itemMaterialName = form.getComponent('itemMaterial').getValue()[materialId].name;
                var bomName = form.getComponent('bomName').getValue();
                var id = form.getComponent('id').getValue();
                me.controller.checkBomItem(materialId,id,bomName,itemMaterialName);
            }
        }]
        me.callParent(arguments);
        var store = Ext.create('CGP.bommaterial.store.MaterialStore');
        store.load();
        store.on('load',function(){
            store.filter([
                {filterFn: function(item) { return item.get("id") != me.parentMaterialId; }}
            ]);
        });
        var id = {
            name: 'id',
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('id'),
            itemId: 'id',
            readOnly: true
        };
        var parentMaterialId = {
            xtype: 'numberfield',
            name: 'parentMaterialId',
            fieldLabel: i18n.getKey('parentMaterialId'),
            itemId: 'parentMaterialId',
            readOnly: true
        };
        var bomItemType = {
            xtype: 'combo',
            fieldLabel: i18n.getKey('bomType'),
            itemId: 'BomItemType',
            name: 'type',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name', type: 'string'},{name: 'value',type: 'string'}
                ],
                data: [
                    {value: 'FIXED',name: i18n.getKey('FIXED')},
                    {value: 'OPTIONAL',name: i18n.getKey('OPTIONAL')},
                    {value: 'UNASSIGN',name: i18n.getKey('UNASSIGN')}
                ]
            }),
            editable: false,
            readOnly: true,
            valueField: 'value',
            displayField: 'name'
        };
        var bomName = {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: i18n.getKey('name'),
            itemId: 'bomName'
        };
        var quantityStrategy = {
            xtype: 'combo',
            name: 'quantityStrategy',
            fieldLabel: i18n.getKey("quantityStrategy"),
            itemId: 'quantityStrategy',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name', type: 'string'}
                ],
                data: [
                    {name: 'basic'}
                ]
            }),
            editable: false,
            valueField: 'name',
            displayField: 'name'
        };
        var store1 = Ext.create('CGP.bommaterial.store.MaterialStore');
        var itemMaterial = {
            name: "itemMaterial",
            xtype: 'gridcombo',
            allowBlank: false,
            fieldLabel: i18n.getKey('itemMaterial'),
            itemId: 'itemMaterial',
            displayField: 'name',
            valueField: 'id',
            autoScroll: true,
            editable: false,
            store: store,
            matchFieldWidth: false,
            multiSelect: false,
            listeners: {
                change: function (combo, record, index) {
                    if(!Ext.isEmpty(Object.keys(combo.getValue())) && me.record.get('type') == 'OPTIONAL'){
                        var itemMaterialId  = parseInt(Object.keys(combo.getValue()));
                        store1.load();
                        store1.on('load',function(){
                            store1.clearFilter();
                            store1.filter([
                                {filterFn: function(item) { return item.get("id") != itemMaterialId }},
                                {filterFn: function(item) { return item.get("id") != me.parentMaterialId}}
                            ]);
                        });
                        me.getComponent('selectableMaterials').setVisible(true);
                        me.getComponent('selectableMaterials').setVisible(true);
                    }
                }
            },
            gridCfg: {
                store: store,
                height: 200,
                width: 500,
                //hideHeaders : true,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 70,
                        dataIndex: 'id'
                    },
                    {
                        text: i18n.getKey('name'),
                        width: 200,
                        dataIndex: 'name',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    },{
                        text: i18n.getKey('description'),
                        width: 200,
                        dataIndex: 'description',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    }
                ],
                bbar : Ext.create('Ext.PagingToolbar', {
                    store : store,
                    displayInfo : true,
                    displayMsg : 'Displaying {0} - {1} of {2}',
                    emptyMsg : i18n.getKey('noData')
                })
            }
        };
        var itemRangeMin = {
            xtype: 'numberfield',
            minValue: 0,
            fieldLabel: i18n.getKey('itemRangeMin'),
            itemId: 'itemRangeMin',
            name: 'itemRangeMin'
        };
        var itemRangeMax = {
            xtype: 'numberfield',
            minValue: 0,
            fieldLabel: i18n.getKey('itemRangeMax'),
            itemId: 'itemRangeMax',
            name: 'itemRangeMax'
        };
        var selectableMaterials = {
            name: "selectableMaterials",
            xtype: 'gridcombo',
            hidden: true,
            allowBlank: false,
            fieldLabel: i18n.getKey('selectableMaterials'),
            itemId: 'selectableMaterials',
            displayField: 'name',
            valueField: 'id',
            autoScroll: true,
            editable: false,
            store: store1,
            matchFieldWidth: false,
            multiSelect: true,
            gridCfg: {
                store: store1,
                height: 200,
                width: 500,
                selType: 'checkboxmodel',
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 70,
                        dataIndex: 'id'
                    },
                    {
                        text: i18n.getKey('name'),
                        width: 200,
                        dataIndex: 'name',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    },{
                        text: i18n.getKey('description'),
                        width: 200,
                        dataIndex: 'description',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    }
                ],
                bbar : Ext.create('Ext.PagingToolbar', {
                    store : store1,
                    displayInfo : true,
                    displayMsg : 'Displaying {0} - {1} of {2}',
                    emptyMsg : i18n.getKey('noData')
                })
            }
        };
        
        var path = {
            name: 'path',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('path'),
            itemId: 'path',
            readOnly: true            
        };
        var nodeId = {
            name: 'nodeId',
            xtype: 'textfield',
            itemId: 'nodeId',
            hidden: true
        }
    }
})