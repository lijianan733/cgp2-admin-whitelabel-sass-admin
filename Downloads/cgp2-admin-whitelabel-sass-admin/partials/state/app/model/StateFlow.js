/**
 * StateFlow
 * @Author: miao
 * @Date: 2021/12/27
 */
 Ext.define('CGP.state.model.StateFlow', {
     extend: 'Ext.data.Model',
     idProperty: '_id',
     fields: [
         {
             name: '_id',
             type: 'number',
             useNull: true
         },
         {
             name: 'clazz',
             type: 'string'
         },
         {
             name: 'module',
             type: 'string'
         },
         {
             name: 'description',
             type: 'string'
         },
         {
             name: 'version',
             type: 'number'
         },
         {
             name: 'status',
             type: 'number'
         }
     ],
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/state/StateFlow',
         reader: {
             type: 'json',
             root: 'data'
         }
     }
 });
