import { TValidRegions, TValidTier } from "brawlhalla-api-ts";

import {
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from "sequelize";

import { db } from ".";

interface GuildRole {
  type: "clan" | TValidTier | TValidRegions;
  role: string;
  value?: string;
}

interface GuildAttributes {
  id: string;
  guildId: string;
  name: string;

  prefix?: string;
  // Channels in which the bot can respond to messages
  botChannels: string[];
  // Channel in which Gerard will post the latest brawlhalla news
  announcementChannel?: string;
  // Automatically assign clan/rank roles when a player joins the server, if known stats
  autoRole: boolean;

  // Roles to automatically assign
  roles: GuildRole[];
  // Role of the server admins
  adminRoles: string[];
  // Role of the server mods
  modRoles: string[];

  serverLanguage: string;
}

interface GuildCreationAttributes extends Optional<GuildAttributes, "id"> {}

export class Guild
  extends Model<GuildAttributes, GuildCreationAttributes>
  implements GuildAttributes {
  id!: string;
  guildId: string;
  name: string;
  prefix: string;
  botChannels: string[];
  announcementChannel?: string;
  autoRole: boolean;
  roles: GuildRole[];
  adminRoles: string[];
  modRoles: string[];
  serverLanguage: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public readonly members?: Player[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    // users: Association<Player, Guild>;
  };
}

Guild.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      defaultValue: "!",
    },
    botChannels: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("botChannels");
        // @ts-ignore
        return rawValue ? rawValue.split(",") : null;
      },
      set(value) {
        // @ts-ignore
        this.setDataValue("botChannels", value.join(","));
      },
    },
    announcementChannel: {
      type: DataTypes.STRING,
    },
    autoRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING,
      get() {
        // @ts-ignore
        const rawValue = this.getDataValue("roles") as string;
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: GuildRole[]) {
        // @ts-ignore
        this.setDataValue("roles", JSON.stringify(value));
      },
    },
    adminRoles: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("adminRoles");
        // @ts-ignore
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // @ts-ignore
        this.setDataValue("adminRoles", value.join(","));
      },
    },
    modRoles: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("modRoles");
        // @ts-ignore
        return rawValue ? rawValue.split(",") : [];
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue("modRoles", value.join(","));
      },
    },
    serverLanguage: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    tableName: "guilds",
  }
);
