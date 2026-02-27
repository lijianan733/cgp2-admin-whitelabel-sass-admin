/**
 * Created by nan on 2025/11/22.
 */
Ext.define('CGP.shipmentrequirement.model.ShipmentRequireListModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        /*     {
                 name: 'items',
                 type: 'array'
             },
            {
                 name: 'outName',
                 type: 'string'
             },
                  {
                      name: 'cost',
                      type: 'float'
                  },
                  */
        {
            name: 'address',
            type: 'object'
        },
        /*   {
               name: 'date',
               type: 'date',
               dateWriteFormat: 'Uu',
               convert: function (value) {
                   return new Date(value);
               }
           },*/
        {
            name: 'shipmentMethod',
            type: 'string'
        },
        {
            name: 'orderDeliveryMethod',
            type: 'string'
        },
        {
            name: 'isLock',
            type: 'boolean'
        },
        {
            name: 'shipRemark',
            type: 'string'
        },
        {
            name: 'customsClearanceRemark',
            type: 'string'
        },
        {
            name: 'dutyType',
            type: 'string'
        },
        {
            name: 'status',
            type: 'object'
        },
        /*    {
                name: 'manufactureCenters',
                type: 'array'
            },*/
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'productionStatus',
            type: 'number'
        },
        {
            name: 'paibanStatus',
            type: 'number'
        },
        {
            name: 'itemSeqNos',
            type: 'array'
        },
        {
            name: 'remark',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentRequirements/v2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
