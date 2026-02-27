/**
 * @Description:
 * @author nan
 * @date 2021/12/29
 */
/**
 *详细页,新建物料时使用
 **/
Ext.syncRequire(['CGP.material.view.information.views.UxFieldContainer']);
Ext.define('CGP.material.view.information.BaseInfoByCreate', {
    extend: 'Ext.form.Panel',
    alias: 'widget.baseinfobycreate',
    defaultType: 'textfield',
    defaults: {
        width: 450,
        labelAlign: 'left',
        margin: '5 25 5 25'
    },
    layout: {
        type: 'table',
        columns: 2
    },
    itemId: 'baseInfo',
    rtTypeNode: null,
    spuRtTypeNode: null,
    parentData: null,
    config: {
        clazz: null,
        category: null,//物料分类
        materialType: null,//物料类型，值MaterialSpu,MaterialType
        parentData: null,//父物料数据
        parentNode: null,
        rtTypeNode: null,//父物料的描述属性的rtType
        spuRtTypeNode: null,//父物料的spu属性的rtType
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('addMaterial');
        var controller = Ext.create('CGP.material.controller.Controller');
        if (!Ext.isEmpty(me.rtTypeNode)) {
            var rtTypeStore = Ext.create('CGP.material.store.RtType', {
                root: me.rtTypeNode
            });
        }
        if (!Ext.isEmpty(me.spuRtTypeNode)) {
            var spuRtTypeStore = Ext.create('CGP.material.store.RtType', {
                root: me.spuRtTypeNode
            });
        }
        var rtTypeAllowBlank;
        if (Ext.isEmpty(me.parentData)) {
            rtTypeAllowBlank = true;
        } else {
            var parentRtType = me.parentData.rtType;
            rtTypeAllowBlank = Ext.isEmpty(parentRtType);
        }
        var spuRtTypeAllowBlank;
        if (Ext.isEmpty(me.parentData)) {
            spuRtTypeAllowBlank = true;
        } else {
            var parentSpuRtType = me.parentData.spuRtType;
            spuRtTypeAllowBlank = Ext.isEmpty(parentSpuRtType);
        }
        var rtType = {
            name: 'rtType',
            xtype: 'uxtreecombohaspaging',
            fieldLabel: i18n.getKey('描述属性rtType'),
            itemId: 'rtType',
            matchFieldWidth: true,
            store: rtTypeStore ? rtTypeStore : Ext.create('CGP.material.store.RtType'),
            displayField: 'name',
            valueField: '_id',
            editable: false,
            haveReset: true,
            rootVisible: me.rtTypeNode != null,
            selectChildren: false,
            canSelectFolders: true,
            allowBlank: rtTypeAllowBlank,
            width: 450,
            labelSeparator: rtTypeAllowBlank ? ':' : ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
            multiselect: false,
            defaultColumnConfig: {
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            showSelectColumns: [
                {
                    dataIndex: '_id',
                    flex: 1,
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    flex: 2
                }
            ],
            listeners: {
                //描述属性rtType和spuRtType是互斥的
                afterrender: function (treeCombo) {
                    var spuRtType = treeCombo.ownerCt.getComponent('spuRtType');
                    treeCombo.store.on('load', function (store, node, records) {
                        var spuRtTypeId = spuRtType.getSubmitValue();
                       ;
                        Ext.Array.each(records, function (item) {
                            if (item.getId() == spuRtTypeId) {
                                node.removeChild(item);
                            }
                        });
                    })
                },
                expand: function (treeCombo) {
                    treeCombo.store.load()
                }
            }
        };
        var spuRtType = Object.create(rtType);
        spuRtType.name = 'spuRtType';
        spuRtType.itemId = 'spuRtType';
        spuRtType.fieldLabel = i18n.getKey('spu属性RtType');
        spuRtType.hidden = me.materialType === 'MaterialSpu';
        spuRtType.rootVisible = me.spuRtTypeNode != null;
        spuRtType.allowBlank = spuRtTypeAllowBlank || me.materialType === 'MaterialSpu';
        spuRtType.store = spuRtTypeStore ? spuRtTypeStore : Ext.create('CGP.material.store.RtType');
        spuRtType.listeners = {
            //描述属性rtType和spuRtType是互斥的
            afterrender: function (treeCombo) {
                var rtType = treeCombo.ownerCt.getComponent('rtType');
                treeCombo.store.on('load', function (store, node, records) {
                    var rtTypeId = rtType.getSubmitValue();
                   ;
                    Ext.Array.each(records, function (item) {
                        if (item.getId() == rtTypeId) {
                            node.removeChild(item);
                        }
                    });
                })
            },
            expand: function (treeCombo) {
                treeCombo.store.load()
            }
        };
        var displayType = {
            MaterialSpu: 'SMU',
            MaterialType: 'SMT'
        };
        me.items = [
            {
                xtype: 'combo',
                itemId: 'clazz',
                value: me.clazz,
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('type'),
                name: 'clazz',
                valueField: 'value',
                displayField: 'display',
                readOnly: true,
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.bom.MaterialType',
                            display: 'SMT',
                        },
                        {
                            value: 'com.qpp.cgp.domain.bom.MaterialSpu',
                            display: 'SMU',
                        }
                    ]
                }
            },
            {
                xtype: 'textfield',
                itemId: 'type',
                value: me.materialType,
                hidden: true,
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('type'),
                name: 'type',
                readOnly: true
            },
            {
                xtype: 'textfield',
                itemId: 'displayType',
                value: displayType[me.materialType],
                hidden: true,
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('type'),
                name: 'displayType',
                readOnly: true
            },
            {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                allowBlank: false,
                labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'textfield',
                itemId: 'code',
                allowBlank: false,
                name: 'code',
                labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                fieldLabel: i18n.getKey('code')
            },
            {
                store: Ext.create('CGP.material.store.MaterialCategory'),
                itemId: 'category',
                disabled: !Ext.isEmpty(me.category),
                hidden: !Ext.isEmpty(me.category),
                name: 'category',
                xtype: 'uxtreecombohaspaging',
                fieldLabel: i18n.getKey('catalog'),
                displayField: 'name',
                valueField: '_id',
                treeWidth: 450,
                allowBlank: false,
                selType: 'rowmodel',
                editable: false,
                rootVisible: false,
                selectChildren: false,
                canSelectFolders: true,
                matchFieldWidth: true,
                multiselect: false,
                defaultColumnConfig: {
                    renderer: function (value, metadata, record) {
                        return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                    }
                },
                showSelectColumns: [
                    {
                        dataIndex: '_id',
                        flex: 1,
                        text: i18n.getKey('id')
                    },
                    {
                        dataIndex: 'name',
                        text: i18n.getKey('name'),
                        flex: 2
                    }
                ]
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('isOutsourcing'),
                name: 'isOutSourcing',
                editable: false,
                labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', {name: 'value', type: 'boolean'}],
                    data: [
                        {name: '是', value: true}
                        ,
                        {name: '否', value: false}
                    ]
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                allowBlank: false,
                itemId: 'isOutsourcing'
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('是否一套'),
                name: 'isPackage',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', {name: 'value', type: 'boolean'}],
                    data: [
                        {name: '是', value: true}
                        ,
                        {name: '否', value: false}
                    ]
                }),
                queryMode: 'local',
                listeners: {
                    change: function (view, newValue, oldValue) {
                        var packageQty = view.ownerCt.getComponent('packageQty');
                        if (newValue == true) {
                            packageQty.setVisible(true);
                            packageQty.setDisabled(false);
                        } else {
                            packageQty.setVisible(false);
                            packageQty.setDisabled(true);
                        }
                        view.ownerCt.doLayout();
                    }
                },
                displayField: 'name',
                valueField: 'value',
                value: false,
                allowBlank: false,
                itemId: 'isPackage'
            },
            {
                fieldLabel: i18n.getKey('每套数量'),
                name: 'packageQty',
                hidden: true,
                xtype: 'numberfield',
                minValue: 0,
                allowBlank: false,
                disabled: true,
                itemId: 'packageQty'
            },

            rtType,
            spuRtType
        ];
        me.callParent(arguments);
    },
});
