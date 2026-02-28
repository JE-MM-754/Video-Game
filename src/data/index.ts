import creatorsJson from "@/data/creators.json";
import borderlands4BuildsJson from "@/data/borderlands4-builds.json";
import helldivers2BuildsJson from "@/data/helldivers2-builds.json";

import type { BL4Build, Creator, HD2Build } from "@/lib/types";

export const creators = creatorsJson as Creator[];
export const helldivers2Builds = helldivers2BuildsJson as HD2Build[];
export const borderlands4Builds = borderlands4BuildsJson as BL4Build[];
