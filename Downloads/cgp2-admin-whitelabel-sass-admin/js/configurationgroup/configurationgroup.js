/**
 *
 */
Ext.syncRequire('CGP.common.store.Website');
Ext.onReady(function () {


    var store = Ext.data.StoreManager.lookup('configGroupStore');
    var websiteStore = Ext.data.StoreManager.lookup('websiteStore');

    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    if (!Ext.isEmpty(getQueryString('websiteId'))) {
        var defaultwebsite = Number(getQueryString('websiteId'));
    }
    //邮件模版的groupId数组。
    var mailTemplateIds = '[2,6,12,13,14,15]';
    var sendMailIds = '[3,7,8]';
    signId = 4;
    signText = 'lisheng';
    var configPage = Ext.create('Ext.container.Viewport', {
        title: 'system config',
        id: 'configPage',
        renderTo: Ext.getBody(),
        frame: false,
        //height: auto,
        //width: 1000,
        layout: 'border',
        items: [
            {
                region: 'center',
                layout: 'fit',
                itemId: 'center',
                autoScroll: true,
                items: []
            },
            {
                region: 'west',
                layout: 'vbox',
                width: 200,
                itemId: 'west',
                split: true,
                autoScroll: true,
                items: [
                    {
                        border: 'false',
                        style: 'margin:10px',
                        height: '50px',
                        width: '100%',
                        labelWidth: '80px',
                        labelStyle: 'font-size:18px;',
                        autoScroll: true,
                        xtype: 'websitecombo',
                        editable: false,
                        name: 'website',
                        labelAlign: 'top',
                        allowBlank: false,
                        itemId: 'website',
                        listConfig: {
                            loadingText: 'loading',
                            emptyText: 'not find a match'
                        },
                        minChars: 1,
                        queryDelay: 100,
                        value: defaultwebsite || 11,
                        listeners: {
                            'change': function (field, newValue, oldValue) {
                                if (signId != null && signText != null) {
                                    onDivClick(signText, signId);
                                }
                            },
                        }
                    },
                    {
                        border: 'false',
                        style: 'margin:10px',
                        height: '50px',
                        width: '100%',
                        autoScroll: true,
                        html: "<div id = 'mailTemplate' onClick= 'onDivClick(\"mailTemplate\"," + mailTemplateIds + ")' " +
                            "style= 'text-decoration:none; color:#000000'" +
                            "class= 'normal' >" +
                            "<div style='line-height:50px; height:50px; margin-left:10px;'>" +
                            "<h style='font-family:verdana;font-size:100%'><b>" + i18n.getKey('mailTemplate') + "</b></h>" +
                            "</div>" +
                            "</div>"
                    },
                    {
                        border: 'false',
                        style: 'margin:10px',
                        height: '50px',
                        width: '100%',
                        autoScroll: true,
                        html: "<div id = 'sendMailCfg' onClick= 'onDivClick(\"sendMailCfg\"," + sendMailIds + ")' " +
                            "style= 'text-decoration:none; color:#000000'" +
                            "class= 'normal' >" +
                            "<div style='line-height:50px; height:50px; margin-left:10px;'>" +
                            "<h style='font-family:verdana;font-size:100%'><b>" + i18n.getKey('sendMailCfg') + "</b></h>" +
                            "</div>" +
                            "</div>"
                    }
                ]
            }
        ]

    });

    // store 加载网站配置组的数据
    store.load({
        //	params : {},
        callback: function (records, options, success) {
            var hideGroupIds = [];
            for (var i = 0; i < records.length; i++) {
                var id = records[i].get('id');
                if (records[i].get('visible') == false) {
                    hideGroupIds.push(records[i].get('id'));
                }
                //过滤掉mailTemplate和sendMail中的配置组，不显示这些组
                var mailTemplateIdList = eval(mailTemplateIds);
                var sendMailIdList = eval(sendMailIds);
                var groupIds = Ext.Array.merge(mailTemplateIdList, sendMailIdList);
                var filterGroupIds = Ext.Array.merge(groupIds, hideGroupIds);
                if (Ext.Array.contains(filterGroupIds, records[i].getId())) {
                    continue;
                } else {
                    configPage.getComponent('west').add({
                        border: 'false',
                        style: 'margin:10px',
                        height: '50px',
                        width: '100%',
                        autoScroll: true,
                        html: "<div id = \"" + records[i].get('id') + "\" onClick= 'onDivClick(\"" + records[i].get('title') + '\",' + records[i].get('id') + ")' " +
                            "style= 'text-decoration:none; color:#000000'" +
                            "class= 'normal' >" +
                            "<div style='line-height:50px; height:50px; margin-left:10px;'>" +
                            "<h style='font-family:verdana;font-size:100%'><b>" + i18n.getKey(records[i].get('title')) + "</b></h>" +
                            "</div>" +
                            "</div>"
                    });
                }
            }
            if (hideGroupIds != []) {
                configPage.getComponent('west').add({
                    border: false,
                    style: 'margin:10px',
                    width: '100%',
                    //height: '50px',
                    //width: '100%',
                    //autoScroll: true,
                    html: "<div " +
                        "style= ' width:176px;height:1px;margin:0px auto;padding:0px;background-color:#FF0000;overflow:hidden'" +
                        "</div>"
                });
            }

            for (var i = 0; i < records.length; i++) {
                var filterGroupIds = [2, 14, 18, 19, 20, 21, 22, 24, 25];
                if (records[i].get('visible') == false) {
                    hideGroupIds.push(records[i].get('id'));
                }
                var displayGroupIds = Ext.Array.difference(hideGroupIds, filterGroupIds)
                if (Ext.Array.contains(displayGroupIds, records[i].getId())) {
                    configPage.getComponent('west').add({
                        border: 'false',
                        style: 'margin:10px',
                        height: '50px',
                        width: '100%',
                        autoScroll: true,
                        html: "<div id = \"" + records[i].get('id') + "\" onClick= 'onDivClick(\"" + records[i].get('title') + '\",' + records[i].get('id') + ")' " +
                            "style= 'text-decoration:none; color:#000000'" +
                            "class= 'normal' >" +
                            "<div style='line-height:50px; height:50px; margin-left:10px;'>" +
                            "<h style='font-family:verdana;font-size:100%'><b>" + i18n.getKey(records[i].get('title')) + "</b></h>" +
                            "</div>" +
                            "</div>"
                    });
                }
            }
        }
    });
});