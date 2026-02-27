/**
 * PushConfigData
 * @Author: miao
 * @Date: 2021/11/30
 */
 Ext.define('CGP.tools.model.PushConfigData', {
     extend: 'Ext.data.Model',
     fields: [
         {
             name: 'name',
             type: 'string'
         },
         {
             name: 'description',
             type: 'string'
         },
         {
             name: 'groupId',
             type: 'string'
         }
     ]
 });
