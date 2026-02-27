/**
 * ImageIntegrationConfigs
 * @Author: miao
 * @Date: 2022/3/28
 */
 Ext.define('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.controller.Jsoncustomizeconfig', {

     /**
      * 添加复制按钮
      * @param p
      */
     copyHandler: function (grid) {
         var store = grid.store;
         var selectItems = grid.getSelectionModel().getSelection();
         if (selectItems.length == 0) {
             Ext.Msg.alert(i18n.getKey('prompt'), '请选中需要复制的配置')
             return;
         }
         Ext.Msg.confirm(i18n.getKey('prompt'), '是否复制选中的配置', function (conf) {
             if (conf == 'yes') {
                 var data=[],seletedData=[];
                 Ext.Array.each(selectItems,function(item){
                     data.push(item.get('_id'));
                     seletedData.push(item.data);
                 });
                 var requestUrl = adminPath + 'api/jsonCustomizeConfigs/copy';
                 Ext.Ajax.request({
                     url: requestUrl,
                     method: 'POST',
                     headers: {
                         Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                     },
                     jsonData:data,
                     success: function (response) {
                         var responseMessage = Ext.JSON.decode(response.responseText);
                         if (responseMessage.success) {
                             store.load();
                             // var resultData=seletedData.concat(responseMessage.data);
                             // Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success')+i18n.getKey('show')+i18n.getKey('copyed+copy')+i18n.getKey('data'), function (confirm) {
                             //     if (confirm == 'yes')
                             //         store.loadData(resultData,false);
                             // });
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
     }
 });