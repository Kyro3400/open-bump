import config from "./config";
import Discord from "discord.js";
import CommandManager from "./CommandManager";
import EventManager from "./EventManager";
import DatabaseManager from "./DatabaseManager";
import NetworkManager from "./NetworkManager";

export default class OpenBump {
  public static instance: OpenBump;

  public directory = __dirname;

  public client: Discord.Client;
  public commandManager: CommandManager;
  public eventManager: EventManager;
  public databaseManager: DatabaseManager;
  public networkManager: NetworkManager;

  constructor() {
    OpenBump.instance = this;

    this.client = new Discord.Client();

    this.commandManager = new CommandManager(this);
    this.eventManager = new EventManager(this);
    this.databaseManager = new DatabaseManager(this);
    this.networkManager = new NetworkManager(this);

    this.init();
  }

  private async init() {
    await this.databaseManager.init();

    console.log("Starting socket connection...");
    await this.networkManager.init();

    console.log(
      `Set client shard to ID ${this.networkManager.id} out of ${this.networkManager.total} shards.`
    );
    this.client.options.shards = [this.networkManager.id];
    this.client.options.shardCount = this.networkManager.total;

    console.log("Logging in to Discord...");
    await this.client.login(config.discord.token);
  }
}