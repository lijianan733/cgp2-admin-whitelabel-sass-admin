Ext.define('CGP.resource.controller.DynamicSizeImage', {
    extend: 'Ext.app.Controller',
    stores: [
        'DynamicSizeImage'
    ],
    models: ['DynamicSizeImage'],
    views: [
        'dynamicSizeImage.Main',
        'dynamicSizeImage.Edit',
        'dynamicSizeImage.RuleForm',

    ],
    init: function () {
        this.control({
            '#dynamicSizeImageMain grid gridcolumn[text=genearateRule] displayfield': {
                render: this.renderColumnDisplay
            },
            'viewport>panel button[itemId=btnSave]': {
                click: this.saveData
            }
        });
    },
    renderColumnDisplay: function (display) {
        var clickElement = document.getElementById('click-genearateRule');
        clickElement.addEventListener('click', function () {
            Ext.create('Ext.window.Window', {
                layout: 'fit',
                modal: true,
                constrain: true,
                width: 600,
                title: i18n.getKey('check'),
                items: [
                    {
                        xtype: 'form',
                        itemId: 'rule',
                        items: [
                            // showComp
                        ]
                    }
                ]
            }).show();
        });
    },

    showCheck: function (display) {
        var clickElement = document.getElementById('click-rule');
        clickElement.addEventListener('click', function () {
            Ext.create('Ext.window.Window', {
                layout: 'fit',
                modal: true,
                constrain: true,
                width: 600,
                title: i18n.getKey('check'),
                items: [
                    {
                        xtype: 'form',
                        itemId: 'rule',
                        items: [
                            {
                                xtype: 'rangeform',
                                itemId: 'rangeForm',
                                name: 'rangeform',
                                listeners: {
                                    afterrender: function (comp) {
                                        if (!Ext.Object.isEmpty(display.record.data)) {
                                            comp.setValue(display.record.data?.range);
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }).show();
        });
    },

    /**
     * ruleGrid rule新增、编辑窗口
     * @param ruleGrid
     * @param record
     */
    addRule: function (ruleGrid, record) {
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('createOrEdit') + i18n.getKey('rule'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'ruleform',
                    itemId: 'ruleForm',
                    border: false,
                    record: record
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('ruleForm');
                        if (!form.isValid()) {
                            return false;
                        }
                        var data = form.getValue();
                        if (Ext.isEmpty(record)) {
                            data._id = JSGetCommonKey();
                            ruleGrid.store.add(data)
                        } else {
                            for (var i in data) {
                                record.set(i, data[i]);
                            }
                        }
                        // ruleGrid.store.load();
                        win.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]

        }).show();
    },

    deleteRule:function (ruleGrid, record) {
        var selectedRcd=ruleGrid.getSelectionModel().getSelection();
        if(selectedRcd.count<1){
            Ext.Msg.alert(i18n.getKey('prompt'), '未选择要删除的数据！');
        }
        else{
            ruleGrid.store.remove(selectedRcd);
        }
        // ruleGrid.store.load();
    },
    saveData: function (btn) {
        var form = btn.ownerCt.ownerCt;
        if (!form.isValid()) {
            return false;
        }
        var data = form.getValue();
        var url = adminPath + 'api/dynamicSizeImages', method = 'POST';
        var id = JSGetQueryString('id');
        if (id) {
            method = 'PUT';
            url += '/' + id;
        }
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                form.data = resp.data;
            }
        };
        JSAjaxRequest(url, method, true, data, null, callback)
    }
});