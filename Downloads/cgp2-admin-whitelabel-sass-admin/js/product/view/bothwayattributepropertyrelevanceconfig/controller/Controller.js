/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller', {
    /**
     * 设置itemsGrid中的值
     * @param record
     * @param itemsGrid
     */
    rightItemGridLoadData: function (record, itemsGrid) {
        var itemsGridLocalStore = itemsGrid.store;
        if (record) {
            itemsGridLocalStore.getProxy().data = [];
            for (var i = 0; i < record.get('items').length; i++) {
                var item = record.get('items')[i];
                item.id = i;
                item.leftSkuAttributes = [];
                item.rightSkuAttributes = [];
                var skuAttributeIds = [];
                for (var j = 0; j < item.left.length; j++) {//设置每条记录包含的skuAttribute
                    var index = skuAttributeIds.indexOf(item.left[j].skuAttribute.id);
                    if (index == -1) {
                        skuAttributeIds.push(item.left[j].skuAttribute.id);
                        item.left[j].skuAttribute.gridColumnsDisplayName = item.left[j].skuAttribute.attribute.name + '<' + item.left[j].skuAttribute.id + '>'
                        item.leftSkuAttributes.push(item.left[j].skuAttribute);
                    }
                }
                for (var j = 0; j < item.right.length; j++) {//设置每条记录包含的skuAttribute
                    var index = skuAttributeIds.indexOf(item.right[j].skuAttribute.id);
                    if (index == -1) {
                        skuAttributeIds.push(item.right[j].skuAttribute.id);
                        item.right[j].skuAttribute.gridColumnsDisplayName = item.right[j].skuAttribute.attribute.name + '<' + item.right[j].skuAttribute.id + '>'
                        item.rightSkuAttributes.push(item.right[j].skuAttribute);
                    }
                }
                item.skuAttributeIds = skuAttributeIds;
            }
            itemsGridLocalStore.getProxy().data = [].concat(record.get('items'));
            itemsGridLocalStore.load();
            itemsGrid.recordId = record.getId();
            itemsGrid.record = record;
            for (var i = 0; i < record.get('skuAttributes').length; i++) {
                var item = record.get('skuAttributes')[i];
                itemsGrid.skuAttributes.add(item.id, item);
            }
        } else {
            itemsGridLocalStore.getProxy().data = [];
            itemsGridLocalStore.load();
            itemsGrid.recordId = null;
            itemsGrid.record = null;
            itemsGrid.skuAttributes.removeAll();
        }
    },
    /**
     * 校验itemTab中的数据
     */
    validItemValue: function (form) {
        var editItemTab = form.ownerCt;
        var itemsGrid = editItemTab.getComponent('itemsGrid');
        var editItemAttributeForm = editItemTab.getComponent('editItemAttributeForm');
        var editItemConditionForm = editItemTab.getComponent('editItemConditionForm');
        var editItemAttributeFormValue = editItemAttributeForm.getFormValue();
        var leftValue = editItemAttributeFormValue.left;
        var rightValue = editItemAttributeFormValue.right;
        var conditionFormValue = editItemConditionForm.getFormValue();
        var isValid = true;
        isValid = editItemAttributeForm.isValid();
        if (isValid == false) {
            return false;
        }
        if (editItemConditionForm.rendered == false && editItemTab.record == null) {//新建，且未渲染
            editItemTab.setActiveTab(editItemConditionForm);
            isValid = editItemConditionForm.isValid();
            return false;
        } else if (editItemConditionForm.rendered == true) {//已经渲染
            isValid = editItemConditionForm.isValid();
            if (isValid == false) {
                editItemTab.setActiveTab(editItemConditionForm);
                return false;
            }
        } else {//编辑，页面为渲染，不需要校验

        }
        if (isValid == false) {
            return false;
        }
        var data = {
            left: leftValue,
            right: rightValue,
            condition: conditionFormValue.condition,
            rightSkuAttributes: [],
            leftSkuAttributes: []
        };
        var skuAttributeIds = [];
        for (var j = 0; j < data.left.length; j++) {//设置每条记录包含的skuAttribute
            var index = skuAttributeIds.indexOf(data.left[j].skuAttribute.id);
            if (index == -1) {
                skuAttributeIds.push(data.left[j].skuAttribute.id);
                data.left[j].skuAttribute.gridColumnsDisplayName = data.left[j].skuAttribute.attribute.name + '<' + data.left[j].skuAttribute.id + '>'
                data.leftSkuAttributes.push(data.left[j].skuAttribute);
            }
        }
        for (var j = 0; j < data.right.length; j++) {//设置每条记录包含的skuAttribute
            var index = skuAttributeIds.indexOf(data.right[j].skuAttribute.id);
            if (index == -1) {
                skuAttributeIds.push(data.right[j].skuAttribute.id);
                data.right[j].skuAttribute.gridColumnsDisplayName = data.right[j].skuAttribute.attribute.name + '<' + data.right[j].skuAttribute.id + '>'
                data.rightSkuAttributes.push(data.right[j].skuAttribute);
            }
        }
        data.skuAttributeIds = skuAttributeIds;
        if (editItemTab.record) {
            var id = editItemTab.record.getId();
            data.id = id;
            editItemTab.itemsGridStore.proxy.data[id] = data;
            editItemTab.itemsGridStore.load();
        } else {
            var id = editItemTab.itemsGridStore.getTotalCount();
            data.id = id;
            editItemTab.itemsGridStore.proxy.data.push(data);
            editItemTab.itemsGridStore.load();
        }
        return true;
    },
    /**
     *  报错配置
     * @param form
     */
    saveItemValue: function (form) {
        var editItemTab = form.ownerCt;
        var leftNavigateGrid = editItemTab.ownerCt.ownerCt.ownerCt.getComponent('leftNavigateGrid');
        var itemsGrid = editItemTab.ownerCt.getComponent('itemsGrid');
        var editItemAttributeForm = editItemTab.getComponent('editItemAttributeForm');
        var recordId = itemsGrid.recordId;
        var name = (itemsGrid.record ? itemsGrid.record.get('name') : itemsGrid.name);
        var productId = editItemTab.ownerCt.productId;
        var itemsValue = itemsGrid.store.proxy.data;
        for (var i = 0; i < itemsValue.length; i++) {
            var item = itemsValue[i];
            for (var j = 0; j < item.left.length; j++) {
                item.left[j].skuAttributeId = item.left[j].skuAttribute.id;
            }
            for (var j = 0; j < item.right.length; j++) {
                item.right[j].skuAttributeId = item.right[j].skuAttribute.id;
            }
        }
        itemsGrid.skuAttributes.removeAll();
        for (var i = 0; i < itemsValue.length; i++) {
            //遍历所有的记录，取出使用过的attributeId
            var item = itemsValue[i];
            for (var j = 0; j < item.skuAttributeIds.length; j++) {
                itemsGrid.skuAttributes.add(item.skuAttributeIds[j], item.skuAttributeIds[j]);
            }
        }
        /*
                var skuAttributesValue = editItemAttributeForm.getComponent('left').localSkuAttributes.concat(editItemAttributeForm.getComponent('right').localSkuAttributes);
        */
        var mask = new Ext.LoadMask(editItemTab, {
            msg: "加载中..."
        });
        mask.show();
        var method = 'POST';
        var url = adminPath + 'api/multiAttributeTwoWayPropertyConfig';

        if (recordId) {
            method = 'PUT';
            url = adminPath + 'api/multiAttributeTwoWayPropertyConfig/' + recordId;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                skuAttributes: itemsGrid.skuAttributes.keys,
                productId: productId,
                items: itemsValue,
                name: name,
                clazz: 'com.qpp.cgp.domain.attributeconfig.MultiAttributeTwoWayPropertyValueConfig'
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        leftNavigateGrid.store.load();
                        editItemTab.close();
                    });

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                mask.hide();
            }
        });
    },
    /**
     * 存删除的修改
     * @param grid
     */
    saveChangeData: function (grid) {
        var recordId = grid.recordId;
        var leftNavigateGrid = grid.ownerCt.ownerCt.ownerCt.getComponent('leftNavigateGrid');
        var name = grid.record.get('name');
        var productId = grid.ownerCt.productId;
        var itemsValue = grid.store.proxy.data;
        var changedSkuAttributes = new Ext.util.MixedCollection();
        for (var i = 0; i < itemsValue.length; i++) {
            var item = itemsValue[i];
            for (var j = 0; j < item.left.length; j++) {
                item.left[j].skuAttributeId = item.left[j].skuAttribute.id;
                changedSkuAttributes.add(item.left[j].skuAttribute.id, item.left[j].skuAttribute);
            }
            for (var j = 0; j < item.right.length; j++) {
                item.right[j].skuAttributeId = item.right[j].skuAttribute.id;
                changedSkuAttributes.add(item.right[j].skuAttribute.id, item.right[j].skuAttribute);
            }
        }
        grid.skuAttributes = changedSkuAttributes;
        var skuAttributesValue = grid.skuAttributes.keys;
        var mask = new Ext.LoadMask(grid, {
            msg: "加载中..."
        });
        mask.show();
        var method = 'PUT';
        var url = adminPath + 'api/multiAttributeTwoWayPropertyConfig/' + recordId;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                skuAttributes: skuAttributesValue,
                productId: productId,
                items: itemsValue,
                name: name,
                clazz: 'com.qpp.cgp.domain.attributeconfig.MultiAttributeTwoWayPropertyValueConfig'
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                    leftNavigateGrid.store.load();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                mask.hide();
            }
        });
    },
    /**
     *删除选择了的item配置
     * @param grid
     */
    deleteSelectedConfig: function (grid) {
        var selectedRecords = grid.getSelectionModel().getSelection();
        if (selectedRecords.length > 0) {
            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                if (select == 'yes') {
                    var count = 0;
                    for (var i = 0; i < selectedRecords.length; i++) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/multiAttributeTwoWayPropertyConfig/' + selectedRecords[i].getId(),
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                count++;
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success && count == selectedRecords.length) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                    grid.store.load();
                                    grid.rightTabPanel.hide();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        });
                    }
                }
            })
        }
    },
    /**
     * 右键菜单上的删除
     * @param grid
     */
    menuDeleteSelectedConfig: function (record, grid) {
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
            if (select == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/multiAttributeTwoWayPropertyConfig/' + record.getId(),
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                            record.store.load();
                            grid.rightTabPanel.hide();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                });
            }
        })
    },
    /**
     * 右键上的修改配置名称
     * @param record
     * @param grid
     */
    menuEditConfigName: function (record, grid) {
        var win = Ext.create('Ext.window.Window', {
            constrain: true,
            width: 400,
            modal: true,
            height: 150,
            layout: 'fit',
            leftNavigateGrid: null,
            title: i18n.getKey('edit') + i18n.getKey('config') + i18n.getKey('name'),
            items: [
                {
                    xtype: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'

                    },
                    items: [
                        {
                            xtype: 'textfield',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('config') + i18n.getKey('name'),
                            name: 'name',
                            itemId: 'name'
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            text: i18n.getKey('confirm'),
                            iconCls: 'icon_agree',
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                if (form.isValid()) {
                                    grid.mask.show();
                                    grid.getSelectionModel().deselectAll();
                                    var name = form.getValues().name;
                                    var method = 'PUT';
                                    var url = adminPath + 'api/multiAttributeTwoWayPropertyConfig/' + record.getId();
                                    var skuAttributeIds = [];
                                    for (var i = 0; i < record.get('skuAttributes').length; i++) {
                                        var item = record.get('skuAttributes')[i];
                                        skuAttributeIds.push(item.id);
                                    }
                                    for (var i = 0; i < record.get('items').length; i++) {
                                        var item = record.get('items')[i];
                                        for (var j = 0; j < item.left.length; j++) {
                                            item.left[j].skuAttributeId = item.left[j].skuAttribute.id;
                                        }
                                        for (var j = 0; j < item.right.length; j++) {
                                            item.right[j].skuAttributeId = item.right[j].skuAttribute.id;
                                        }
                                    }
                                    Ext.Ajax.request({
                                        url: url,
                                        method: method,
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: {
                                            skuAttributes: skuAttributeIds,
                                            productId: record.get('productId'),
                                            items: record.get('items'),
                                            name: name,
                                            clazz: 'com.qpp.cgp.domain.attributeconfig.MultiAttributeTwoWayPropertyValueConfig'
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));
                                                win.close();
                                                grid.rightTabPanel.hide();
                                                grid.store.load();
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                            grid.mask.hide();
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            grid.mask.hide();
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (btn) {
                                win.close();
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    }
})
