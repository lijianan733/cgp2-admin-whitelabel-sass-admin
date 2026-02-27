/**
 * Created by nan on 2017/12/18.
 */
Ext.define('CGP.partner.view.partnerordernotifyhistory.controller.Controller', {
    createExtraParamsString: function (value, id) {
        var resultdata = value;
        var returnStr = '<table>';
        var datacount = 0;
        if (value && resultdata) {
            for (var i in resultdata) {
                datacount++;
                if (datacount <= 2) {
                    returnStr += '<tr>' + i + " : " + resultdata[i] + '</tr><br>'
                }
                if (datacount > 2) {
                    var parme = Ext.JSON.encode(resultdata).replace(/"/g, '\'');
                    returnStr += '<tr>' + new Ext.Template('<a href="javascript:{handler}">' + 'more...' + '</a>').apply({
                        handler: "showContext(" + id + ")"
                    }) + '</tr>';
                    break;
                }

            }
            returnStr += '</table>';
            return returnStr;
        } else {
            return;
        }
    },
    showContextDetail: function (record) {
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: [JSJsonToTree(record.data.context)]
            }
        });
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            frame: false,
            border: false,
            padding: 10,
            layout: 'anchor',
            items: [
                {
                    xtype: 'fieldset',
                    title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('context') + '</font>',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    layout: 'fit',
                    defaultType: 'displayfield',
                    items: [
                        Ext.create('Ext.tree.Panel', {
                            rootVisible: false,
                            text: 'Simple Tree2',
                            bodyPadding:false,
                            store: store,
                            useArrows: true,
                            lines: false,
                            selModel: Ext.create("Ext.selection.RowModel", {
                                mode: "multi",
                                allowDeselect: true,
                                enableKeyNav: true
                            }),
                            viewConfig: {
                                enableTextSelection: true
                            },
                            tbar: [
                                {
                                    xtype: 'button',
                                    text: '全部展开',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.expandAll();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '全部收缩',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.collapseAll();
                                    }
                                },
                                '->',
                                {
                                    xtype: 'textfield',
                                    itemId: 'research',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.collapseAll()
                                    }
                                },
                                {
                                    //该查找只能查找出第一个匹配数据
                                    xtype: 'button',
                                    text: '查找',
                                    handler: function (view) {
                                        var treePanel = view.ownerCt.ownerCt;
                                        var research = view.ownerCt.getComponent('research').getValue().trim();
                                        if (research) {
                                            var store = treePanel.store;
                                            var rootRecord = store.getRootNode();
                                            var selectRecordArray = [];
                                            var selectMode = treePanel.getSelectionModel();
                                            rootRecord.cascadeBy(function (node) {
                                                if (node.get('text').match(research)) {//模糊查找出所有匹配项
                                                    selectRecordArray.push((node))
                                                    treePanel.expandPath(node.getPath());
                                                }
                                            });
                                            selectMode.select(selectRecordArray);
                                        }
                                    }
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'treecolumn',
                                    text: 'key',
                                    flex: 2,
                                    dataIndex: 'text',
                                    sortable: true
                                },
                                {
                                    text: 'value',
                                    flex: 5,
                                    dataIndex: 'value'
                                }
                            ]
                        })
                    ]
                }

            ]
        });
        var win=Ext.create('Ext.window.Window', {
            title: i18n.getKey('context')+i18n.getKey('detail'),
            height: 600,
            width: 800,
            maximizable:true,
            modal:true,
            layout: 'fit',
            items: [form]
        });
        win.show();
    }
})