/**
 *
 */
Ext.Loader.syncRequire('CGP.cmsvariable.model.CmsVariable');
Ext.onReady(function () {


    var websiteStore = Ext.create('CGP.cmsvariable.store.Website');
    var page = Ext.widget({
        block: 'cmsvariable',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.cmsvariable.model.CmsVariable',
            remoteCfg: false,
            items: [

                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('code'),
                    allowBlank: false
                },
                {
                    name: 'selector',
                    xtype: 'textfield',
                    itemId: 'selector',
                    fieldLabel: i18n.getKey('selector')
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    itemId: 'variableType',
                    allowBlank: false,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'REST_API_LIST', value: 'REST_API_LIST'
                            },
                            {
                                type: 'JSON_OBJ', value: 'JSON_OBJ'
                            },
                            {
                                type: 'REST_API', value: 'REST_API'
                            },
                            {
                                type: 'CONSTANT', value: 'CONSTANT'
                            },
                            {
                                type: 'URL', value: 'URL'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('type'),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    xtype: 'gridcombo',
                    //matchFieldWidth: true,
                    itemId: 'websiteCombo',
                    fieldLabel: i18n.getKey('website'),
                    allowBlank: false,
                    name: 'website',
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    width: 450,
                    store: websiteStore,
                    queryMode: 'remote',
                    gridCfg: {
                        store: websiteStore,
                        width: 350,
                        hideHeaders : true,
                        columns: [{
                            text: 'name',
                            width: 350,
                            dataIndex: 'name'
                        }]
                    }
                },
                {
                    name: 'description',
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'

                },
                {
                    name: 'value',
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('value'),
                    colspan:2,
                    width: 750,
                    itemId: 'value',
                    //通过api文档，我们知道要捕捉keydown事件，必须设置此项
                    enableKeyEvents: true,
                    //定义制表符
                    tabText: '\t',
                    //
                    listeners: {
                        keydown: function (f, e) {
                            if (e.getKey() == e.TAB) {
                                e.stopEvent();//停止事件
                                insertAtCursor(f.inputEl.dom, f.tabText);
                            }
                            //插入指定字符并重新计算输入光标的位置
                            function insertAtCursor(el, ins) {
                                if (el.setSelectionRange) {
                                    var withIns = el.value.substring(0, el.selectionStart) + ins;
                                    var pos = withIns.length;
                                    el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
                                    el.setSelectionRange(pos, pos);
                                } else if (document.selection) {
                                    document.selection.createRange().text = ins;
                                }
                            }
                        }
                    },
                    height: 200,
                    allowBlank: false
                }
            ]
        }
    });
});