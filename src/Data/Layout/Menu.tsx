import { MenuItem } from "@/Types/Layout.type";

export const MenuList: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",     
    Items: [
      {
        title: "Pages",
        id: 1,
        icon: "home",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Sample Page",
            path: `/pages/sample_page`,
            type: "link",
          },
          {
            title: "Purchase Plan",
            path: `/pages/purchase_plan`,
            type: "link",
          },
        ],
      },
      { id: 33, path: "https://support.pixelstrap.com/", icon: "support-tickets", type: "link", active: false, title: "Support Ticket" },
    ],
  },
];
