Ext.define("CGP.product.view.managerskuattribute.view.SelectNoSkuAttributeGrid", {
    extend: 'CGP.common.field.SearchGrid',
    alias: 'widget.selectnoattributegrid',
    width: 950,
    height: 500,
    filterDate: null,
    initComponent: function () {
        var me = this;
        var isSku = me.isSku;
        var profileStore = me.profileStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }])
            }
        });
        me.store = Ext.create('CGP.product.view.managerskuattribute.store.SelectAttributeGridStore', {
            aimUrlId: me.productId,
            proxyUrl: adminPath + 'api/products/configurable/' + me.productId + '/skuAttributesV2',
            proxyReader: {
                type: 'json',
                root: 'data.content'
            }
        });
        me.gridCfg = {
            isValid: function () {
                var me = this;
                var isValid = true;
        /*        var comboFieldArr = [];
                comboFieldArr = me.query("combo[disabled=false]");
                for (var i = 0; i < comboFieldArr.length; i++) {
                    if (comboFieldArr[i].isValid() == false) {
                        isValid = false;
                    }
                }
                console.log(comboFieldArr);*/
                return isValid;
            },
            suppressSelectEvent: false,
            profileAttributeData: {},
            profileStore: profileStore,
            store: me.store,
            editAction: false,
            deleteAction: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                checkOnly: true,
                injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                mode: "multi",//multi,simple,single；默认为多选multi
                allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以								通过点击checkbox取消对其的选择
                enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                showHeaderCheckbox: true//如果此项为false在复选框列头将不显示.
            }),
            viewConfig: {
                markDirty: false//标识修改的字段
            },
            listeners: {
                deselect: function (selectModel, record) {
                    var attributeId = record.getId();
                    var profileField = selectModel.view.ownerCt.query("combo[itemId=profile_" + attributeId + "]")[0];
                    var groupField = selectModel.view.ownerCt.query("combo[itemId=group_" + attributeId + "]")[0];
                    profileField.setDisabled(true);
                    groupField.setDisabled(true);

                },
                select: function (selectModel, record) {
                    var attributeId = record.getId();
                    var profileField = selectModel.view.ownerCt.query("combo[itemId=profile_" + attributeId + "]")[0];
                    var groupField = selectModel.view.ownerCt.query("combo[itemId=group_" + attributeId + "]")[0];
                    profileField.setDisabled(false);
                    groupField.setDisabled(false);
                }
            },
            columns: [
                {
                    dataIndex: 'id',
                    width: 80,
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'code',
                    text: i18n.getKey('code'),
                    renderer: function (value, metadata, record) {
                        if (isSku) {
                            return record.get('attribute').code;
                        } else {
                            return value;
                        }
                    }
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    renderer: function (value, metadata, record) {
                        if (isSku) {
                            return record.get('attribute').name;
                        } else {
                            return value;
                        }
                    }
                },
                {
                    dataIndex: 'inputType',
                    text: i18n.getKey('inputType'),
                    renderer: function (value, metadata, record) {
                        if (isSku) {
                            return record.get('attribute').inputType;
                        } else {
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('options'),
                    dataIndex: 'options',
                    itemId: 'options',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        if (isSku) {
                            value = record.raw.options;
                        }
                        var v = [];
                        Ext.Array.each(value, function (data) {
                            v.push(data.name);
                        })
                        //是颜色option 展示颜色块
                        if (record.raw.inputType == 'Color') {
                            var color = [];
                            Ext.Array.each(v, function (c) {

                                color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[1] + '"></a>');

                            })
                            v = color;
                        }
                        v = v.join(',');
                        return v;
                    }
                },
                {
                    text: i18n.getKey('所属profile'),
                    xtype: 'componentcolumn',
                    itemId: 'profile',
                    width: 150,
                    renderer: function (value, metadata, record, a, b, c, view) {
                        var attributeId = record.getId();
                        var grid = view.ownerCt;
                        if (grid.profileAttributeData[attributeId]) {
                            value = grid.profileAttributeData[attributeId].profileId
                        }
                        return {
                            xtype: 'combo',
                            store: profileStore,
                            valueField: '_id',
                            editable: false,
                            disabled: true,
                            attributeId: attributeId,
                            name: 'profile',
                            haveReset: true,
                            itemId: 'profile_' + attributeId,
                            displayField: 'name',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var groupField = view.ownerCt.query("combo[itemId=group_" + attributeId + "]")[0];
                                    if (newValue) {
                                        groupField.reset();
                                        var groupData = combo.store.getById(newValue).getData().groups;
                                        groupField.profileId = newValue;
                                        groupField.store.proxy.data = groupData;
                                        groupField.store.load();
                                    } else {
                                        groupField.setValue();
                                    }
                                },
                                afterrender: function (combo) {
                                    if (value) {
                                        combo.setValue(value);
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('所属group'),
                    itemId: 'group',
                    width: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, a, b, c, view) {
                        var attributeId = record.getId();
                        var grid = view.ownerCt;
                        if (grid.profileAttributeData[attributeId]) {
                            value = grid.profileAttributeData[attributeId].groupId
                        }
                        return {
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                data: [],
                                fields: ['_id', 'name']
                            }),
                            valueField: '_id',
                            disabled: true,
                            editable: false,
                            name: 'group',
                            value: value,
                            attributeId: attributeId,
                            profileId: null,
                            itemId: 'group_' + attributeId,
                            displayField: 'name',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    grid.profileAttributeData;
                                    var attributeId = combo.attributeId;
                                    var profileId = combo.profileId;
                                    if (newValue) {
                                        grid.profileAttributeData[attributeId] = {
                                            profileId: profileId,
                                            groupId: newValue
                                        }
                                        console.log(grid.profileAttributeData);
                                    } else {
                                        delete grid.profileAttributeData[attributeId];
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 90,
            header: false,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    id: 'codeSearchField',
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }
            ]
        };
        me.callParent(arguments);
    }
});


