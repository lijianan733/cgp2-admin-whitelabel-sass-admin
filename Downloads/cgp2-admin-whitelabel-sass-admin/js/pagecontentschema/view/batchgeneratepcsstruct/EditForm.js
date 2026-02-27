Ext.define('CGP.pagecontentschema.view.batchgeneratepcsstruct.EditForm', {
    extend: 'Ext.form.Panel',
    /*layout: 'fit',*/
    isValidForItems: true,//是否校验时用item.forEach来处理
    itemId: 'information',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'uxtextarea',
                itemId: 'content',
                name: 'content',
                width: 800,
                colspan: 2,
                allowBlank: false,
                height: 300,
                fieldLabel: i18n.getKey('content'),
                toolbarConfig: {
                    items: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('预览'),
                            iconCls: 'x-form-search-trigger', //your iconCls here
                            handler: function (view) {
                                var win = Ext.create("Ext.window.Window", {
                                    itemId: "layers",
                                    layout: 'fit',
                                    title: i18n.getKey('预览'),
                                    modal: true,
                                    width: 800,
                                    height: 800,
                                    html: view.ownerCt.ownerCt.textarea.getValue()
                                });
                                win.show();
                            },
                            scope: this,
                            tooltip: i18n.getKey('预览'),
                            overflowText: i18n.getKey('预览')
                        }, {
                            xtype: 'filefield',
                            buttonOnly: true,
                            buttonConfig: {
                                iconCls: 'icon_folder',
                                text: i18n.getKey('上传')
                            },
                            listeners: {
                                change: function (comp, newValue, oldValue) {
                                    var file = this.fileInputEl.dom.files[0];
                                    var that =this;
                                    var reader = new FileReader();
                                    reader.addEventListener('load', function (evt) {
                                        if(that.activeErrors == null) {
                                            me.getComponent('content').setValue(evt.target.result);
                                        }
                                    });
                                    reader.readAsText(file,'UTF-8');
                                }
                            }
                        }
                    ]
                }
            },
            Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.UserParamsForm')
        ];
        me.callParent(arguments);

    },
    dealXmlData: function (str) {
        var me = this;

        function getXmlNode(str) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(str, "text/xml");
            var reacts = xmlDoc.getElementsByTagName('.blood');

            var arr = [];

            for (var i = 0; i < reacts.length; i++) {
                arr.push(reacts[i].textContent);
            };
            xmlDoc.getElementsByClassName('pos')[0].children[0].getAttribute('x')
            return arr;

        }

        function infoToJson(str) {
            var s = getXmlNode(str);
            var obj = eval('(' + s + ')');
            //console.log(obj[0].id)
            return obj;
        }

        infoToJson(str);
    },
    getValue: function () {
        var me = this;
        var resultData = {};
        resultData.content = me.getComponent('content').getValue();
        resultData.userParams = me.getComponent('userParamsForm').getValue();
        return resultData;
    }
});
