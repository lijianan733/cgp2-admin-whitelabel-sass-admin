Ext.Loader.syncRequire('CGP.product.view.productattributeprofile.view.DragDropField');
Ext.define('CGP.product.view.productattributeprofile.view.EditProfileGroup1', {
    extend: 'Ext.form.Panel',
    defaults: {
        msgTarget: 'side'
    },
    bodyStyle: 'border-color:silver;padding:10px',

    initComponent: function () {
        var me = this;

        //me.title = '<font color=green>' + i18n.getKey('selectOptions') + '</font>';
        me.width = "100%";
        var tm = new Ext.util.TextMetrics(), maxLabelWidth = 0;
        var leftStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'displayName',
                    type: 'string',
                    convert: function (value, record) {
                        return value
                    }
                },
                {
                    name: 'attribute',
                    type: 'object'
                },
                {
                    name: 'attributeName',
                    type: 'string',
                    convert: function (value, record) {
                        var name = record.get('attributeName');
                        var id = record.get('id');
                        if (!Ext.isEmpty(name)) {
                            return name;
                        } else {
                            return value;
                        }
                    }
                },
                {
                    name: 'belongGroup', type: 'string'
                },
                {
                    name: 'code', type: 'string'
                }
            ],
            /*proxy : {
             type : 'memory'
             },*/
            data: /*[
             {id: 123, displayName: 'aaa', attributeName: 'bbb', belongGroup: 'vvv'}
             ]*/Ext.isEmpty(me.record) ? [] : me.record.get('attributes')
        });
        var allGroups = [];
        Ext.each(me.skuAttributeStore.data.items, function (item) {
            allGroups.push(item.data);
        });

        var otherGroupsrecord = Ext.Array.clone(me.allRecords.data.items);
        Ext.each(otherGroupsrecord, function (group) {
            if (group) {
                if (me.record) {
                    if (me.record.getData()._id == group.data._id) {
                        Ext.Array.remove(otherGroupsrecord, group);
                    }
                }
            }
        });
        var otherGroups = [];
        Ext.each(otherGroupsrecord, function (item) {
            otherGroups.push(item.data);
        });
        var selfGroup = null;
        if (me.record) {
            selfGroup = me.record.getData();
        }
        var rightStore = me.getRightStore(allGroups, selfGroup, otherGroups);

        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                width: 350,
                itemId: 'name',
                allowBlank: true,
                value: Ext.isEmpty(me.record) ? '' : me.record.get('name')

            }, {
                name: 'displayName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('displayName'),
                width: 350,
                itemId: 'displayName',
                value: Ext.isEmpty(me.record) ? '' : me.record.get('displayName')
            },
            {
                name: 'sort',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                width: 350,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('sortOrder'),
                itemId: 'sort',
                value: Ext.isEmpty(me.record) ? otherGroupsrecord.length : me.record.get('sort')
            },
            {
                name: 'attributes',
                xtype: 'dragdropfield',
                width: '100%',
                panelConfig: {
                    width: '100%',
                    leftGridConfig: {
                        title: i18n.getKey('现分组sku属性'),
                        multiSelect: true,
                        flex: 1,
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                dataIndex: 'displayName',
                                width: 150,
                                text: i18n.getKey('displayName'),
                                renderer: function (value, meta, record) {
                                    return value + '<' + record.get('id') + '>'
                                }
                            },
                            {
                                dataIndex: 'code',
                                width: 150,
                                text: i18n.getKey('code')
                            }
                        ],

                        store: leftStore,
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                ddGroup: 'selDD',
                                enableDrag: true,
                                enableDrop: true
                            }
                        }
                    },
                    rightGridConfig: {
                        //id: 'General Attribute',
                        title: i18n.getKey('可选sku属性'),
                        multiSelect: true,
                        flex: 1,
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                dataIndex: 'displayName',
                                text: i18n.getKey('displayName'),
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value + '<' + record.get('id') + '>';
                                }
                            },
                            {
                                dataIndex: 'code',
                                text: i18n.getKey('code'),
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'belongGroup',
                                flex: 1,
                                text: i18n.getKey('已属分组Id'),
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            }
                        ],
                        store: rightStore,
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                ddGroup: 'selDD',
                                enableDrag: true,
                                enableDrop: true
                            }
                        }
                    }
                },
                fieldLabel: i18n.getKey('attributeSet'),
                itemId: 'attributes'
                /*id: 'groups'*//**//**/
            }
        ];

        me.callParent(arguments);

        me.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function () {
                        var form = this.ownerCt.ownerCt;
                        me.saveValue(form, otherGroupsrecord);
                    }
                }, {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        var win = this.ownerCt.ownerCt.ownerCt;
                        win.close();
                    }
                }

            ]
        });
    },
    /**
     *获取创建分组可以选择的属性
     * @param allGroups 所有属性
     * @param selfGroup 如果是编辑，所编辑分组的属性
     * @param otherGroups 其它分组的属性
     * @returns {Ext.data.Store}
     */
    getRightStore: function (allGroups, selfGroup, otherGroups) {
        var otherGroupSkuAttri = [];
        if (!Ext.isEmpty(otherGroups)) {
            Ext.each(otherGroups, function (group) {
                Ext.each(group.attributes, function (attribute) {
                    otherGroupSkuAttri.push({
                        displayName: attribute.displayName,
                        attributeName: Ext.isEmpty(attribute.attribute) ? attribute.attributeName : attribute.attribute.name,
                        code: attribute.code,
                        id: attribute.id,
                        belongGroup: group._id
                    })
                })
            })
        }
        var allSelectAttri = [];

        Ext.each(allGroups, function (attribute) {

            allSelectAttri.push({
                displayName: attribute.displayName,
                attributeName: Ext.isEmpty(attribute.attribute) ? attribute.attributeName : attribute.attribute.name,
                code: attribute.code,
                id: attribute.id
            })
        });
        var allLength = allSelectAttri.length;
        var removeIds = [];
        Ext.each(otherGroupSkuAttri, function (attribute) {

            removeIds.push(attribute.id);

        });
        for (var i = 0; i < allSelectAttri.length; i++) {

            if (Ext.Array.contains(removeIds, allSelectAttri[i].id)) {
                allSelectAttri.splice(i--, 1);
            }


        }

        allSelectAttri = Ext.Array.merge(allSelectAttri, otherGroupSkuAttri);
        var selfGroupAttri = [];
        if (!Ext.isEmpty(selfGroup)) {
            Ext.Array.each(selfGroup.attributes, function (attribute) {
                selfGroupAttri.push({
                    displayName: attribute.displayName,
                    attributeName: Ext.isEmpty(attribute.attribute) ? attribute.attributeName : attribute.attribute.name,
                    id: attribute.id
                })
            })
        }
        var canSelectAttri = [];
        var allLengthV2 = allSelectAttri.length;
        var removeIdsV2 = [];
        Ext.each(selfGroupAttri, function (attribute) {

            removeIdsV2.push(attribute.id);

        });
        if (!Ext.isEmpty(selfGroupAttri)) {
            for (var i = 0; i < allSelectAttri.length; i++) {
                if (Ext.Array.contains(removeIdsV2, allSelectAttri[i].id)) {
                    allSelectAttri.splice(i--, 1);
                }
            }

        }
        canSelectAttri = allSelectAttri;


        var rightStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'displayName',
                    type: 'string',
                    convert: function (value, record) {
                        return value
                    }
                },
                {
                    name: 'attributeName',
                    type: 'string'
                },
                {
                    name: 'atribute',
                    type: 'object'
                },
                {
                    name: 'belongGroup', type: 'string'
                },
                {
                    name: 'code', type: 'string'
                }
            ],
            /*proxy : {
             type : 'memory'
             },*/
            data: canSelectAttri
        });
        return rightStore;
    },
    /**
     * 保存属性分组的值
     */
    saveValue: function (form, otherGroupsrecord) {
        var me = this;
        var data = {};
        var attributesComp = form.getComponent('attributes');
        var otherAttributes = attributesComp.getRightStore().data.items;
        if (form.isValid()) {
            Ext.Array.each(form.items.items, function (item) {
                if (item.name == 'attributes') {
                    data[item.name] = item.getSubmitValue();
                } else {
                    data[item.name] = item.getValue();
                }
            });
            if (!Ext.isEmpty(me.record)) {
                Ext.Object.each(data, function (key, value) {
                    me.record.set(key, value);
                });
            } else {
                data._id = JSGetCommonKey(false);
                me.allRecords.add(data);
            }
            Ext.each(otherGroupsrecord, function (record) {
                var groupAttribute = [];
                Ext.each(otherAttributes, function (attribute) {
                    if (attribute.data.belongGroup == record.data._id) {
                        groupAttribute.push(attribute.data)
                    }
                });
                if (!Ext.isEmpty(groupAttribute)) {
                    record.set('attributes', groupAttribute);
                } else {
                    me.allRecords.remove(record);
                }
            });
            var win = me.ownerCt;
            win.close();
            //me.allRecords.load();
        }
    }

});
