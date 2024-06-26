import { IPlayer, IPlayerWithRolls } from "../../domain/entities/types"
import { IplayerRepository } from "../../domain/intefaces/playerRepository"
import { PrismaClient } from "../../../prisma/generated/client"

//Aqui van las persistencias/consultas posibles de cada metodo

export class PlayerRepository implements IplayerRepository {
  prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient()
  }
  async findPlayerByName(name: string): Promise<IPlayer | null> {
    console.log("findPlayerByName ", name)
    try {
      return await this.prisma.player.findFirst({
        where: {
          name: name.trim(),
          NOT: {
            name: "ANONIMO",
          },
        },
      })
    } catch (err) {
      console.log(err)
    }
    return null
  }

  async findPlayerByID(playerId: number): Promise<IPlayer> {
    const foundPlayer = await this.prisma.player.findUnique({
      where: {
        id: playerId,
      },
    })

    if (!foundPlayer) {
      throw new Error("Jugador no encontrado")
    }

    return foundPlayer
  }

  async createPlayer(name: string): Promise<IPlayer> {
    console.log("nn", name)
    return await this.prisma.player.create({
      data: {
        name: name.trim() || "ANONIMO",
      },
    })
  }

  async existingPlayer(playerId: number): Promise<IPlayer | null> {
    return await this.prisma.player.findUnique({
      where: {
        id: playerId,
      },
    })
  }

  async existingName(name: string, playerId: number): Promise<IPlayer | null> {
    return await this.prisma.player.findFirst({
      where: {
        name: name,
        id: {
          not: {
            equals: playerId,
          },
        },
      },
    })
  }

  async updatePlayerName(
    name: string,
    playerId: number
  ): Promise<IPlayer | null> {
    return await this.prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        name: name || "ANONIMO",
      },
    })
  }

  async getAllPlayersAndRolls(): Promise<IPlayerWithRolls[] | null> {
    return await this.prisma.player.findMany({
      include: {
        rolls: true,
      },
    })
  }
}
