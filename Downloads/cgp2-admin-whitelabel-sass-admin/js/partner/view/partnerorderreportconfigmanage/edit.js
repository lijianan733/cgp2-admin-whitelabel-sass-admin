/**
 * Created by nan on 2018/1/11.
 */
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    var reportConfigFormValuePageIsShow = 0;
    var diyEmailFieldComponentValuePageIsShow = 0;
    var tab = Ext.create('Ext.tab.Panel', {
        listeners: {
            tabchange: function () {
                for (var i = 0; i < arguments[0].items.items.length; i++) {
                    arguments[0].items.items[i].msgPanel.hide();
                }
                if (arguments[1].itemsId == 'reportConfigForm' && reportConfigFormValuePageIsShow < 2) {
                    controller.setReportConfigFormValue(arguments[0].items.items[2], arguments[0].items.items[2].config.configRecode);
                    if (createOrUpdate == 'create') {
                        arguments[0].items.items[2].getComponent('productConfigs')._grid.getView().refresh();
                    }
                    reportConfigFormValuePageIsShow++;
                }
                if (arguments[1].itemsId == 'emailTemplateConfigForm' && diyEmailFieldComponentValuePageIsShow < 2) {
                    controller.setDiyEmailFieldComponentValue(arguments[0].items.items[1], arguments[0].items.items[1].config.configRecode);
                    diyEmailFieldComponentValuePageIsShow++;
                }
            }
        }
    });
    var recordId = JSGetQueryString('recordId');
    var partnerId = JSGetQueryString('partnerId');
    var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
    var configStore = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.store.PartnerOrderReportConfigStore', {
        partnerId: partnerId,
        params: {
            filter: Ext.JSON.encode(
                [
                    {"name": "_id", "value": recordId + '', "type": "string"}
                ]
            )
        }
    });

    var createOrUpdate = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var configRecode = '';
    configStore.on('load', function () {
        if (createOrUpdate == 'edit') {
            configRecode = configStore.getAt(0);//获取对应的记录
            var baseInfoForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.BaseInfoForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                id: 'baseInfoForm',
                itemId: 'baseInfoForm',
                title: i18n.getKey('baseInfo')
            });
            var emailTemplateConfigForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.EmailTemplateConfigForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                id: 'emailTemplateConfigForm',
                itemId: 'emailTemplateConfigForm',
                title: i18n.getKey('emailTemplate') + i18n.getKey('config')
            });
            var reportConfigForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.ReportConfigForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                id: 'reportConfigForm',
                itemId: 'reportConfigForm',
                title: i18n.getKey('报表显示配置')
            });
            tab.add([baseInfoForm, emailTemplateConfigForm, reportConfigForm]);
            reportConfigForm.show();
            tab.setActiveTab(reportConfigForm);
            tab.setActiveTab(emailTemplateConfigForm);
            tab.setActiveTab(baseInfoForm);
        } else {
            configRecode = Ext.create(configStore.model);
            var baseInfoForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.BaseInfoForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                itemId: 'baseInfoForm',
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                id: 'baseInfoForm',
                title: i18n.getKey('baseInfo')
            });
            var emailTemplateConfigForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.EmailTemplateConfigForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                itemId: 'emailTemplateConfigForm',
                id: 'emailTemplateConfigForm',
                title: i18n.getKey('emailTemplate') + i18n.getKey('config')
            });
            var reportConfigForm = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.ReportConfigForm', {
                configRecode: configRecode,
                recordId: recordId,
                partnerId: partnerId,
                createOrUpdate: createOrUpdate,
                configStore: configStore,
                tab: tab,
                itemId: 'reportConfigForm',
                id: 'reportConfigForm',
                title: i18n.getKey('报表显示配置')
            });
            tab.add([baseInfoForm, emailTemplateConfigForm, reportConfigForm]);
            tab.setActiveTab(reportConfigForm);
            tab.setActiveTab(emailTemplateConfigForm);
            tab.setActiveTab(baseInfoForm);
        }
    });
    page.add(tab);
    window.deleteEmail = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
    window.deleteEmail = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
})