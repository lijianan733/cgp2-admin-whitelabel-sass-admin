Ext.ns('Qpp.CGP.ExpressPostage.Controller');

/**
 *在body展开时 显示rule的grid
 */



Qpp.CGP.ExpressPostage.Controller.expandBody = function (rowNode, record, expandRow) {

    var id = record.get('id');
    var gridId = 'express-postage-rule-grid-' + id;
    var containerId = 'express-postage-rule-content-' + id;

    //    if (!Ext.getCmp(gridId)) {
    if (Ext.getCmp(gridId))
        Ext.getCmp(gridId).destroy();

    Qpp.CGP.ExpressPostage.Controller._generateRuleGrid(record, gridId, containerId);


}


Qpp.CGP.ExpressPostage.Controller._generateRuleGrid = function (record, gridId, containerId) {
    var controller = Qpp.CGP.ExpressPostage.Controller;

    var cellEditing = new Ext.grid.plugin.CellEditing({
        clicksToEdit: 1,
        listeners: {
            edit: function (editor, e) {
                e.record.commit();
            }
        }
    });

    var numberEditorConfig = {
        xtype: 'numberfield',
        allowBlnk: false,
        hideTrigger: true,
        allowExponential: false,
        decimalPrecision: 1
    }
    var grid = new Ext.grid.Panel({
        id: gridId,
        recordId: record.get('id'),
        renderTo: Ext.get(containerId),
        width: 900,
        height: 300,
        plugins: [cellEditing],
        store: _generateRuleStore(record),
        columns: [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            sortable: false,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'icon_remove icon_margin',
                itemId: 'actionremove',
                tooltip: 'Remove',
                handler: function (view, rowIndex, colIndex) {
                    var store = view.getStore();
                    store.removeAt(rowIndex);
                }
                            }]
                        }, {
            dataIndex: 'startWeight',
            text: i18n.getKey('startWeight'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'endWeight',
            text: i18n.getKey('endWeight'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'firstWeight',
            text: i18n.getKey('firstWeight'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'firstFee',
            text: i18n.getKey('firstFee'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'plusWeight',
            text: i18n.getKey('plusWeight'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'plusFee',
            text: i18n.getKey('plusFee'),
            editor: numberEditorConfig
        }, {
            dataIndex: 'extraFeeRate',
            width: 150,
            text: i18n.getKey('extraFeeRate'),
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                hideTrigger: true,
                allowExponential: false,
                maxValue: 100,
                minValue: 0,
                decimalPrecision: 2
            }
        }],
        tbar: [{
            xtype: 'button',
            text: i18n.getKey('add'),
            handler: controller.addPostageRule
        }, {
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: controller.savePostageRule
        }]
    });

    function _generateRuleStore(record) {

        var ruleStore = new Ext.data.Store({
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'startWeight',
                type: 'float'
            }, {
                name: 'endWeight',
                type: 'float'
            }, {
                name: 'firstWeight',
                type: 'float'
            }, {
                name: 'firstFee',
                type: 'float'
            }, {
                name: 'plusWeight',
                type: 'float'
            }, {
                name: 'plusFee',
                type: 'float'
            }, {
                name: 'extraFeeRate',
                type: 'int'
            }],
            data: _generateRuleId(record.get('id'), record.get('rules'))
        });

        /**
         * 根据输入的rule顺序生成id
         */
        function _generateRuleId(id, rules) {
            var data = [];

            Ext.Array.each(rules, function (rule, index) {

                var d = Ext.clone(rule);

                d.id = index;

                data.push(d);

            });

            return data;
        }

        return ruleStore;

    }

}


Qpp.CGP.ExpressPostage.Controller.addPostageRule = function () {
    var ruleStore = this.ownerCt.ownerCt.getStore();
    var last = ruleStore.getAt(ruleStore.getCount() - 1);
    var newRuleData = last.raw;
    newRuleData.startWeight = last.get('endWeight');
    newRuleData.id = last.get('id') + 1;
    ruleStore.insert(ruleStore.getCount(), newRuleData);

}

Qpp.CGP.ExpressPostage.Controller.savePostageRule = function () {
    var ruleStore = this.ownerCt.ownerCt.getStore();
    var postageStore = Ext.data.StoreManager.lookup('expressPostageStore');
    var postageId = this.ownerCt.ownerCt.recordId;

    var postage = postageStore.getById(postageId);

    //    postage.set('rules', getAllStoreData(ruleStore));

    var submitData = Ext.clone(postage.data);
    submitData.rules = getAllStoreData(ruleStore);

    savePostage(submitData);

    function savePostage(data) {

        var request = {
            url: adminPath + 'api/admin/postage/express/' + data.id + '?access_token=' + Ext.util.Cookies.get('token'),
            method: 'PUT',
            jsonData: data,
            callback: function (options, success, response) {
                if (success) {
                    Ext.Msg.alert('Info', 'Save Success!');
                }else{
                    var resp = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            }
        }

        Ext.Ajax.request(request);

    }


    function getAllStoreData(store) {
        var data = [];

        store.each(function (record) {
            var d = Ext.clone(record.data);
            delete d.id;
            data.push(d);
        })

        return data;
    }


}