import cables_devices from "./cables_devices.js";
import modulation from "./modulation.js";
import net_commands from "./net_commands.js";
import ip_class from "./ip_class.js";
import routing_protocols from "./routing_protocols.js";
import csma_cd from "./csma_cd.js";
import csma_ca from "./csma_ca.js";
import subnetting from "./subnetting.js";
import routing_dv from "./routing_dv.js";
import routing_ls from "./routing_ls.js";
import udp_chat from "./udp_chat.js";
import tcp_transfer from "./tcp_transfer.js";
import dns from "./dns.js";
import vlans_trunking from "./vlans_trunking.js";
import nat_acl from "./nat_acl.js";
import stp_etherchannel from "./stp_etherchannel.js";
import ipv6_basics from "./ipv6_basics.js";

export const LABS = [
  cables_devices,
  modulation,
  net_commands,
  ip_class,
  csma_cd,
  csma_ca,
  subnetting,
  vlans_trunking,
  routing_protocols,
  routing_dv,
  routing_ls,
  udp_chat,
  tcp_transfer,
  dns,
  nat_acl,
  stp_etherchannel,
  ipv6_basics,
];
