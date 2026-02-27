/**
 * Created by nan on 2020/12/14
 */
Ext.define('CGP.pagecontent.controller.Controller', {
    savePageContentConfig: function (data, tab) {
        var me = this;
        var url = adminPath + 'api/pageContents';
        var jsonData = data;
        var method = 'POST';
        var successMsg = i18n.getKey('addsuccessful');
        data.clazz = 'com.qpp.cgp.domain.bom.runtime.PageContent';
        if (data._id) {
            method = 'PUT';
            successMsg = i18n.getKey('modifySuccess');
            url = adminPath + 'api/pageContents/' + data._id;
        }
        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success == true) {
                tab.setValue(responseText.data);
                var editPage = top.Ext.getCmp('tabs').getComponent('pagecontent_edit');
                if (editPage) {
                    editPage.setTitle(i18n.getKey('edit') + i18n.getKey('pageContent') + '(' + responseText.data._id + ')');
                }
            }
        })
    },
    /**
     *查看json数据
     */
    checkPageContentSchemaData: function (data, tab) {
        var controller = this;
        var valueString = JSON.stringify(data, null, "\t");
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('pageContent') + '(手动编辑JSON数据，可能导致界面报错，请注意输入数据正确性)',
            items: [{
                name: 'value',
                xtype: 'textarea',
                itemId: 'jsonData',
                width: 800,
                height: 700,
                readOnly: false,
                vtype: 'json',
                autoScroll: true,//通过api文档，我们知道要捕捉keydown事件，必须设置此项
                enableKeyEvents: true,
                //定义制表符
                tabText: '\t',
                value: valueString,
            }],
            bbar: [
                '->',
                {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var textarea = win.getComponent('jsonData');
                        if (textarea.isValid()) {
                            var pageContentData = Ext.JSON.decode(textarea.getValue());
                            var result = controller.savePageContentConfig(pageContentData, tab);
                            //保存json数据后刷新
                            if (result) {
                                if (location.search.includes('id')) {//编辑

                                } else {
                                    location.href = location.href + '?id=' + result._id;
                                }
                            }
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }
            ]

        });
        win.show();
    },
    /**
     *批量创建pc
     */
    batchCreatePageContent: function (grid) {
        var controller = this;

        JSShowJsonData([], '使用json数组批量创建(数据必须为合法的数组结构)', {
            vtype: null,
        }, {
            bbar: {
                items: [
                    '->',
                    {
                        xtype: 'button',
                        iconCls: 'icon_agree',
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var textArea = win.items.items[0];
                            if (textArea.isValid()) {
                                var count = 0;
                                try {
                                    var pcArr = Ext.JSON.decode(textArea.getValue());
                                } catch (e) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('非法的数组'));
                                    return;
                                }
                                win.el.mask('处理中...');
                                for (var i = 0; i < pcArr.length; i++) {
                                    var data = pcArr[i];
                                    data.generateMode = "manual";
                                    data.clazz = 'com.qpp.cgp.domain.bom.runtime.PageContent';
                                    delete data._id;
                                    JSAjaxRequest(adminPath + 'api/pageContents', 'post', true, data, null, function (require, success, response) {
                                        count++;
                                        if (count == pcArr.length) {
                                            win.el.unmask();
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('addsuccessful'), function () {
                                                grid.store.load();
                                            });
                                            win.close();
                                        }
                                    });
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.close();
                        }
                    }
                ]
            }
        })
    }
})