/**
 * @Description:先根据类目，得到该类目关联的产品，再根据产品，显示对应产品的属性，把产品的属性添加到属性列表中
 * @author nan
 * @date 2022/4/29
 */
Ext.Loader.syncRequire([])
Ext.define('CGP.cmsconfig.view.AddSEOWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    layout: 'fit',
    outGird: null,
    record: null,
    outGrid: null,
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.items.items[0];
                if (form.isValid()) {
                    var value = form.getValues();
                    var result = {};
                    if (value.keyName == 'name') {
                        result.name = value.keyValue;
                    } else if (value.keyName == 'property') {
                        result.property = value.keyValue;
                    } else if (value.keyName == 'httpEquiv') {
                        result.httpEquiv = value.keyValue;
                    }
                    result.content = value.contentValue;
                    console.log(result)
                    win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];
                    if (win.record) {
                        win.outGrid.store.proxy.data[win.record.index] = result;
                    } else {
                        win.outGrid.store.proxy.data.push(result);
                    }
                    win.outGrid.store.load();
                    win.close();
                }
            }
        },
        lastStepBtnCfg: {
            hidden: false,
            iconCls: '',
            text: '转换特殊字符',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.getComponent('form');
                var fields = form.query('[xtype=textfield]');
                fields.map(function (item) {
                    var uxtextarea = item;
                    var oldStr = uxtextarea.getValue();
                    var newStr = JSHtmlEnCode(oldStr);
                    uxtextarea.setValue(newStr);
                });
            }
        },
    },
    listeners: {
        afterrender: function () {
            var win = this;
            if (win.record) {
                var form = win.items.items[0];
                var data = win.record.getData();
                var result = {};
                if (data.name) {
                    result.keyName = 'name';
                    result.keyValue = data.name;
                } else if (data.property) {
                    result.keyName = 'property';
                    result.keyValue = data.property;
                } else if (data.httpEquiv) {
                    result.keyName = 'httpEquiv';
                    result.keyValue = data.httpEquiv;
                }
                result.contentValue = data.content;
                for (var i in result) {
                    form.getComponent(i).setValue(result[i]);
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.title = 'meta';
        me.items = [{
            xtype: 'errorstrickform',
            isValidForItems: true,
            itemId: 'form',
            autoScroll: true,
            border: false,
            margin: 5,
            bodyStyle: {
                borderColor: 'silver'
            },
            defaults: {
                allowBlank: false,
            },
            showErrors: Ext.emptyFn,
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'displayfield',
                    value: '&lt;meta '
                },
                {
                    xtype: 'combo',
                    displayField: 'display',
                    valueField: 'value',
                    name: 'keyName',
                    itemId: 'keyName',
                    width: 100,
                    editable: false,
                    margin: '0 5',
                    vtype: 'forbidSpecialChars',
                    store: {
                        xtype: 'store',
                        fields: [
                            'value',
                            'display'
                        ],
                        data: [
                            {
                                value: 'name',
                                display: 'name'
                            },
                            {
                                value: 'property',
                                display: 'property'
                            },
                            /* {
                                 value: 'itemprop',
                                 display: 'itemprop'
                             },*/
                            {
                                value: 'httpEquiv',
                                display: 'httpEquiv'
                            }
                        ]
                    }
                },
                {
                    xtype: 'displayfield',
                    value: ' = "',
                    margin: '0 5',
                },
                {
                    xtype: 'textfield',
                    displayField: 'keyValue',
                    valueField: 'keyValue',
                    itemId: 'keyValue',
                    flex: 1,
                    name: 'keyValue',
                    vtype: 'forbidSpecialChars',

                },
                {
                    xtype: 'displayfield',
                    itemId: 'content',
                    margin: '0 5',
                    name: 'content',
                    allowBlank: false,
                    value: '" content="'
                },
                {
                    xtype: 'textfield',
                    grow: true,
                    rows: 1,
                    width: 250,
                    minHeight: 24,
                    growMin: 10,
                    flex: 1,
                    itemId: 'contentValue',
                    name: 'contentValue',
                    anchor: '100%',
                    vtype: 'forbidSpecialChars',
                },
                {
                    margin: '0 5',
                    xtype: 'displayfield',
                    allowBlank: false,
                    value: '"&gt;'
                },
            ],
        }];
        me.callParent();
    },
})